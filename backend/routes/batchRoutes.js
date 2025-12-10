import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import XLSX from 'xlsx'
import Batch from '../models/Batch.js'
import Project from '../models/Project.js'
import QRCode from 'qrcode'
import { PDFDocument } from 'pdf-lib'

const router = express.Router()

const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
})

const upload = multer({ storage })
const MAX_LIMIT = Number(process.env.MAX_LIMIT || 250)


// -----------------------------------------------
//  STEP 2 - UPLOAD BATCH ZIP
// -----------------------------------------------
router.post('/upload-zip', upload.single('zipfile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'no file' })

    const zip = new AdmZip(req.file.path)
    const entries = zip.getEntries().filter(e => !e.isDirectory)

    // Find mapping file
    const excelEntry = entries.find(e =>
      e.entryName.match(/\.xlsx?$/i) || e.entryName.match(/\.csv$/i)
    )

    if (!excelEntry) {
      return res.status(400).json({ error: 'No mapping file (CSV/XLSX) found' })
    }

    let rows = []
    const buffer = excelEntry.getData()

    // CSV parse
    if (excelEntry.entryName.match(/\.csv$/i)) {
      const lines = buffer.toString('utf8').split(/\r?\n/).filter(Boolean)
      const headers = lines[0].split(',').map(h => h.trim())
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',')
        const obj = {}
        headers.forEach((h, idx) => obj[h] = cols[idx] || '')
        rows.push(obj)
      }
    } else {
      // XLSX parse
      const wb = XLSX.read(buffer, { type: 'buffer' })
      const sheet = wb.Sheets[wb.SheetNames[0]]
      rows = XLSX.utils.sheet_to_json(sheet)
    }

    if (rows.length > MAX_LIMIT) {
      return res.status(400).json({ error: `Max limit ${MAX_LIMIT} exceeded`, total: rows.length })
    }

    const filenames = entries.map(e => e.entryName)

    const valid = []
    const invalid = []

    for (const r of rows) {
      const fname = r.filename || r.file || r.fileName || r.File
      const id = r.certificateId || r.id || r.certId

      if (!fname || !filenames.includes(fname)) {
        invalid.push({ row: r, reason: 'file missing' })
      } else {
        valid.push({ id, filename: fname })
      }
    }

    // Save batch info
    const batch = new Batch({
      projectId: req.body.projectId || null,
      originalZip: req.file.filename,
      total: rows.length,
      validCount: valid.length,
      invalidCount: invalid.length,
      status: 'validated'
    })
    await batch.save()

    const batchId = batch._id.toString()

    // Extract to temp folder
    const tempDir = path.join(uploadDir, batchId)
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
    zip.extractAllTo(tempDir, true)

    // Build chunks
    const estimatedSeconds = Math.round(valid.length * 0.5 + 0.2 * Math.ceil(valid.length / 50))
    const chunks = []
    for (let i = 0; i < valid.length; i += 50) {
      chunks.push(valid.slice(i, i + 50).map(v => v.filename))
    }

    res.json({
      success: true,
      batchId,
      summary: {
        total: rows.length,
        valid: valid.length,
        invalid: invalid.length,
        estimatedSeconds,
        chunks
      }
    })

  } catch (e) {
    console.error(e)
    res.status(500).json({ error: String(e) })
  }
})


// -----------------------------------------------
//  STEP 3 - START ISSUANCE
// -----------------------------------------------
router.post('/start-issuance', async (req, res) => {
  try {
    const { batchId } = req.body
    const batch = await Batch.findById(batchId)
    if (!batch) return res.status(404).json({ error: 'batch not found' })

    batch.status = 'processing'
    await batch.save()

    const tempDir = path.join(uploadDir, batchId)
    const issuedDir = path.join(uploadDir, 'issued', batchId)
    if (!fs.existsSync(issuedDir)) fs.mkdirSync(issuedDir, { recursive: true })

    const files = fs.readdirSync(tempDir)

    // Find mapping file again
    let map = files.find(f => f.match(/certificate_map\.(xlsx|csv|xls)/i))
    if (!map) map = files.find(f => f.match(/\.xlsx$/i))
    if (!map) map = files.find(f => f.match(/\.csv$/i))

    let mappings = []

    if (map && map.match(/\.csv$/i)) {
      const txt = fs.readFileSync(path.join(tempDir, map), 'utf8')
      const lines = txt.split(/\r?\n/).filter(Boolean)
      const headers = lines[0].split(',').map(h => h.trim())
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',')
        const obj = {}
        headers.forEach((h, idx) => obj[h] = cols[idx] || '')
        mappings.push(obj)
      }
    } else if (map) {
      const wb = XLSX.readFile(path.join(tempDir, map))
      const sheet = wb.Sheets[wb.SheetNames[0]]
      mappings = XLSX.utils.sheet_to_json(sheet)
    } else {
      // PDF fallback
      mappings = files
        .filter(f => f.toLowerCase().endsWith('.pdf'))
        .map((f, i) => ({ certificateId: 'id-' + i, filename: f }))
    }

    const io = req.io
    const results = []

    for (const item of mappings) {
      const fname = item.filename || item.File || item.file
      const id = item.certificateId || item.id || item.certId || fname

      const verifyUrl = `https://verify.example.com?id=${encodeURIComponent(id)}`
      const qrDataUrl = await QRCode.toDataURL(verifyUrl)

      const srcPath = path.join(tempDir, fname)

      if (!fs.existsSync(srcPath)) {
        results.push({ id, filename: fname, status: 'failed', reason: 'missing source' })
        io.emit('batch:update', { batchId, issued: results.filter(r => r.status === 'issued').length, total: mappings.length })
        continue
      }

      const existing = fs.readFileSync(srcPath)
      const pdfDoc = await PDFDocument.load(existing)
      const pngBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64')
      const png = await pdfDoc.embedPng(pngBytes)

      const pages = pdfDoc.getPages()
      const first = pages[0]
      const { width } = first.getSize()

      const proj = batch.projectId ? await Project.findById(batch.projectId) : null

      const qrWidth = 100
      const x = proj?.qrPos?.x || width - qrWidth - 40
      const y = proj?.qrPos?.y || 40

      first.drawImage(png, { x, y, width: qrWidth, height: qrWidth })

      const out = await pdfDoc.save()
      fs.writeFileSync(path.join(issuedDir, fname), out)

      results.push({ id, filename: fname, status: 'issued', url: `/uploads/issued/${batchId}/${fname}` })

      io.emit('batch:update', {
        batchId,
        issued: results.filter(r => r.status === 'issued').length,
        total: mappings.length
      })

      await new Promise(r => setTimeout(r, 300))
    }

    batch.status = 'completed'
    batch.results = results
    await batch.save()

    io.emit('batch:completed', { batchId, results })

    res.json({ success: true })

  } catch (e) {
    console.error(e)
    res.status(500).json({ error: String(e) })
  }
})


// -----------------------------------------------
//  GET BATCH STATUS
// -----------------------------------------------
router.get('/status/:batchId', async (req, res) => {
  const batch = await Batch.findById(req.params.batchId)
  if (!batch) return res.status(404).json({ error: 'not found' })
  res.json(batch)
})


// -------------------------------------------------
//  FIXED — DOWNLOAD ISSUED ZIP
// -------------------------------------------------
router.get('/download-issued/:batchId', (req, res) => {
  try {
    const batchId = req.params.batchId
    const issuedDir = path.join(uploadDir, 'issued', batchId)

    if (!fs.existsSync(issuedDir)) {
      return res.status(404).json({ error: 'No issued files found' })
    }

    const zip = new AdmZip()
    const files = fs.readdirSync(issuedDir)

    files.forEach(file => {
      zip.addLocalFile(path.join(issuedDir, file))
    })

    const zipName = `${batchId}_issued.zip`
    const zipPath = path.join(uploadDir, zipName)

    zip.writeZip(zipPath)

    return res.download(zipPath)

  } catch (e) {
    console.error('Download ZIP error:', e)
    return res.status(500).json({ error: 'Failed to create issued ZIP' })
  }
})


export default router
