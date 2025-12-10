import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import projectRoutes from './routes/projectRoutes.js'
import batchRoutes from './routes/batchRoutes.js'
import path from 'path'
import fs from 'fs'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI;
await mongoose.connect(MONGO_URI)

console.log('Connected to MongoDB')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: '*' }
})

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  req.io = io
  next()
})

const uploads = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true })

app.use('/api/projects', projectRoutes)
app.use('/api/batch', batchRoutes)
app.use('/uploads', express.static(uploads))

const PORT = process.env.PORT || 4000

server.listen(PORT, () => console.log('Server running on', PORT))
