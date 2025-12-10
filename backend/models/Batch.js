import mongoose from 'mongoose'

const BatchSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  originalZip: String,
  total: Number,
  validCount: Number,
  invalidCount: Number,
  status: { type: String, default: 'validated' },
  results: Array,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Batch', BatchSchema)
