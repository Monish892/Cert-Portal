import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Project from '../models/Project.js'

const router = express.Router()

const uploadDir = path.join(process.cwd(), 'uploads', 'templates')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
})

const upload = multer({ storage })

// Create Project
router.post('/create', async (req, res) => {
  const { name, description, issuer, issueDate } = req.body
  const project = new Project({ name, description, issuer, issueDate })
  await project.save()
  res.json({ success: true, projectId: project._id })
})

// Upload Certificate Template
router.post('/upload-template', upload.single('template'), async (req, res) => {
  const { projectId } = req.body
  const project = await Project.findById(projectId)

  if (!project) return res.status(404).json({ error: 'project not found' })

  project.templateFilename = req.file.filename
  await project.save()

  res.json({ success: true, filename: req.file.filename })
})

// Save QR Position
router.post('/save-qr', async (req, res) => {
  const { projectId, x, y } = req.body
  const project = await Project.findById(projectId)

  if (!project) return res.status(404).json({ error: 'project not found' })

  project.qrPos = { x: Number(x), y: Number(y) }
  await project.save()

  res.json({ success: true })
})

// Get Project Details
router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) return res.status(404).json({ error: 'not found' })
  res.json(project)
})

export default router
