import { useState } from 'react'
import { Upload, FileArchive, Play, CheckCircle2, AlertCircle, Clock, Package, Zap, TrendingUp, Shield, Download, X } from 'lucide-react'

export default function Step2() {
  const [batchId, setBatchId] = useState('')
  const [summary, setSummary] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [starting, setStarting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const onUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)
    setUploading(true)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const fd = new FormData()
      fd.append('zipfile', file)
      const res = await fetch('http://localhost:4000/api/batch/upload-zip', {
        method: 'POST',
        body: fd
      })
      const data = await res.json()
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      setTimeout(() => {
        setBatchId(data.batchId)
        setSummary(data.summary)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 5000)
      }, 500)
    } catch (error) {
      clearInterval(progressInterval)
      alert('Upload failed: ' + error.message)
    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 1000)
    }
  }

  const start = async () => {
    if (!batchId) return alert('Please upload a file first')
    
    setStarting(true)
    try {
      await fetch('http://localhost:4000/api/batch/start-issuance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId })
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      alert('Failed to start: ' + error.message)
    } finally {
      setStarting(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3 min-w-80">
            <div className="bg-gray-100 rounded-full p-2">
              <CheckCircle2 className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Success</p>
              <p className="text-xs text-gray-600">Operation completed successfully</p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-900 rounded-lg p-3">
              <FileArchive className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Batch Upload Center
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Step 2: Upload and process your certificate batch</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            <div className="flex items-center">
              <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-semibold">✓</div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">Prepare</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-700"></div>
            <div className="flex items-center">
              <div className="bg-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-semibold">2</div>
              <span className="ml-2 text-sm font-medium text-gray-900 hidden sm:inline">Upload</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 text-sm font-semibold">3</div>
              <span className="ml-2 text-sm font-medium text-gray-500 hidden sm:inline">Process</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-gray-900 p-6 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Upload Your Batch</h2>
                    <p className="text-gray-300 text-sm">Select a ZIP file containing certificates</p>
                  </div>
                  <Upload className="w-10 h-10 opacity-70" />
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {!batchId ? (
                  <div>
                    <label className="block">
                      <input
                        type="file"
                        accept=".zip"
                        onChange={onUpload}
                        disabled={uploading}
                        className="hidden"
                        id="file-upload"
                      />
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-all
                          ${uploading 
                            ? 'border-gray-400 bg-gray-50' 
                            : 'border-gray-300 hover:border-gray-900 hover:bg-gray-50'
                          }`}
                        onClick={() => !uploading && document.getElementById('file-upload').click()}
                      >
                        {uploading ? (
                          <div className="space-y-4">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                              <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-gray-900 mb-2">Uploading {fileName}</p>
                              <div className="max-w-md mx-auto">
                                <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                  <div 
                                    className="bg-gray-900 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  ></div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{uploadProgress}% complete</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                              <FileArchive className="w-10 h-10 text-gray-700" />
                            </div>
                            <p className="text-xl font-semibold text-gray-900 mb-2">
                              Drop your ZIP file here
                            </p>
                            <p className="text-gray-500 mb-4">or click to browse</p>
                            <div className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                              <Upload className="w-5 h-5" />
                              Choose File
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Maximum file size: 100MB</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Success Banner */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-900 rounded-full p-2 flex-shrink-0">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 mb-2">Upload Complete</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-gray-700">Batch ID:</span>
                              <code className="bg-white px-3 py-1 rounded border border-gray-200 text-gray-800 font-mono text-xs break-all flex-1">
                                {batchId}
                              </code>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-gray-700">File:</span>
                              <span className="text-gray-600">{fileName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Stats */}
                    {summary && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-700" />
                            Batch Analysis
                          </h3>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="bg-gray-200 rounded-lg p-2">
                                  <Package className="w-4 h-4 text-gray-700" />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 uppercase">Total</span>
                              </div>
                              <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
                              <p className="text-xs text-gray-500 mt-1">Files</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="bg-gray-900 rounded-lg p-2">
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 uppercase">Valid</span>
                              </div>
                              <div className="text-2xl font-bold text-gray-900">{summary.valid}</div>
                              <p className="text-xs text-gray-600 mt-1">{((summary.valid/summary.total)*100).toFixed(1)}% success</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="bg-gray-400 rounded-lg p-2">
                                  <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 uppercase">Invalid</span>
                              </div>
                              <div className="text-2xl font-bold text-gray-900">{summary.invalid}</div>
                              <p className="text-xs text-gray-600 mt-1">Need review</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="bg-gray-200 rounded-lg p-2">
                                  <Clock className="w-4 h-4 text-gray-700" />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 uppercase">Time</span>
                              </div>
                              <div className="text-2xl font-bold text-gray-900">{summary.estimatedSeconds}</div>
                              <p className="text-xs text-gray-600 mt-1">Seconds (est.)</p>
                            </div>
                          </div>
                        </div>

                        {/* Chunks Visualization */}
                        {summary.chunks && summary.chunks.length > 0 && (
                          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Zap className="w-5 h-5 text-gray-700" />
                              Processing Chunks ({summary.chunks.length})
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {summary.chunks.map((chunk, i) => (
                                <div
                                  key={i}
                                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-900 transition-all hover:shadow-sm"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-600 uppercase">Chunk {i + 1}</span>
                                    <div className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                                      {chunk.length}
                                    </div>
                                  </div>
                                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div 
                                      className="bg-gray-900 h-full rounded-full"
                                      style={{ width: `${(chunk.length/summary.total)*100}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {((chunk.length/summary.total)*100).toFixed(1)}% of total
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={start}
                      disabled={starting}
                      className="w-full bg-gray-900 hover:bg-gray-800 
                        disabled:bg-gray-400
                        text-white font-semibold px-8 py-4 rounded-lg
                        transition-all duration-200
                        disabled:cursor-not-allowed
                        flex items-center justify-center gap-3 shadow-sm hover:shadow-md
                        group"
                    >
                      {starting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Starting Issuance...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          <span>Start Certificate Issuance</span>
                          <TrendingUp className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Info & Tips */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-700" />
                Quick Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-lg p-2 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Secure Upload</p>
                    <p className="text-xs text-gray-600">End-to-end encrypted transfer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-lg p-2 mt-1">
                    <Zap className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Fast Processing</p>
                    <p className="text-xs text-gray-600">Parallel batch processing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-lg p-2 mt-1">
                    <Download className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Auto Backup</p>
                    <p className="text-xs text-gray-600">All data safely stored</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-900 rounded-lg p-2">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">•</span>
                  <span>Ensure all files are in the correct format before uploading</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">•</span>
                  <span>Large batches are automatically split into optimal chunks</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">•</span>
                  <span>You can track progress in real-time after starting</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">•</span>
                  <span>Invalid files will be flagged for review</span>
                </li>
              </ul>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact our support team for assistance with batch uploads
              </p>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-4 py-2.5 rounded-lg transition-all text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}