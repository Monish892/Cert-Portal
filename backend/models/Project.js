import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  issuer: String,
  issueDate: String,
  templateFilename: String,
  qrPos: {
    x: Number,
    y: Number
  },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Project', ProjectSchema)
