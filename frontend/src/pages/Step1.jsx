import { useState } from 'react'
import { FileText, Upload, CheckCircle2, AlertCircle, Crosshair, Sparkles, Calendar, User, FileSignature, Target, Info, Zap, Shield, Clock, X } from 'lucide-react'

export default function Step1() {
  const [form, setForm] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    description: ''
  })

  const [projectId, setProjectId] = useState('')
  const [file, setFile] = useState(null)
  const [pdfError, setPdfError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [qrPosition, setQrPosition] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Create Project
  const onCreate = async () => {
    if (!form.name || !form.issuer || !form.issueDate) {
      return alert('Please fill all required fields.')
    }

    setCreating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      const mockProjectId = 'PROJ-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      setProjectId(mockProjectId)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (e) {
      console.error(e)
      alert('Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  // Handle file select
  const onFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPdfError(null)
    setUploadSuccess(false)
  }

  // Upload Template PDF
  const uploadTemplate = async () => {
    if (!projectId) return alert('Create project first')
    if (!file) return alert('Select a PDF file first')

    setUploading(true)
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      setUploadSuccess(true)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (e) {
      console.error(e)
      alert('Upload Failed')
    } finally {
      setUploading(false)
    }
  }

  // Save QR Click Location
  const onPageClick = (e) => {
    if (!projectId) return alert('Create project first')

    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(e.clientX - rect.left)
    const y = Math.round(e.clientY - rect.top)

    setQrPosition({ x, y })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
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
              <p className="text-xs text-gray-600">
                {qrPosition ? `QR Position: X:${qrPosition.x} Y:${qrPosition.y}` : 'Operation completed'}
              </p>
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
              <FileSignature className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Project Setup
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Step 1: Create your certificate project and upload template</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            <div className="flex items-center">
              <div className="bg-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-semibold">1</div>
              <span className="ml-2 text-sm font-medium text-gray-900 hidden sm:inline">Setup</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 text-sm font-semibold">2</div>
              <span className="ml-2 text-sm font-medium text-gray-500 hidden sm:inline">Upload</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 text-sm font-semibold">3</div>
              <span className="ml-2 text-sm font-medium text-gray-500 hidden sm:inline">Process</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-gray-900 p-6 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Project Information</h2>
                    <p className="text-gray-300 text-sm">Fill in the basic details for your certificate project</p>
                  </div>
                  <Sparkles className="w-10 h-10 opacity-70" />
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="space-y-5">
                  {/* Project Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      Project Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none text-gray-900 placeholder-gray-400"
                      placeholder="e.g., Annual Achievement Awards 2024"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  {/* Issuer Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      Issuer Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none text-gray-900 placeholder-gray-400"
                      placeholder="e.g., ABC University or John Smith"
                      value={form.issuer}
                      onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                    />
                  </div>

                  {/* Issue Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      Issue Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none text-gray-900"
                      value={form.issueDate}
                      onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      Project Description
                      <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Describe the purpose of this certificate project..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                {/* Create Button */}
                <button
                  className="mt-6 w-full bg-gray-900 hover:bg-gray-800 
                    text-white font-semibold px-8 py-3.5 rounded-lg
                    transition-all duration-200
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                    flex items-center justify-center gap-3 shadow-sm hover:shadow-md
                    group"
                  onClick={onCreate}
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Project...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Create Project</span>
                    </>
                  )}
                </button>

                {/* Success Message */}
                {projectId && (
                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-900 rounded-full p-2 flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Project Created Successfully</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700 text-sm">Project ID:</span>
                            <code className="bg-white px-3 py-1 rounded border border-gray-200 text-gray-800 font-mono text-sm">
                              {projectId}
                            </code>
                          </div>
                          <p className="text-sm text-gray-600">You can now upload your certificate template below</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Template Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-gray-900 p-6 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Certificate Template</h2>
                    <p className="text-gray-300 text-sm">Upload your PDF template and set QR code position</p>
                  </div>
                  <Upload className="w-10 h-10 opacity-70" />
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {!projectId && (
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-700 rounded-lg p-2 flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1 text-sm">Project Required</p>
                        <p className="text-sm text-gray-600">Please create a project first before uploading your template</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Template PDF File
                    </label>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className={`flex-1 relative ${!projectId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={onFile}
                          disabled={!projectId}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className={`border-2 border-dashed rounded-lg px-6 py-4 text-center transition-all
                          ${file 
                            ? 'border-gray-400 bg-gray-50' 
                            : 'border-gray-300 hover:border-gray-900 hover:bg-gray-50'
                          }`}>
                          <div className="flex items-center justify-center gap-3">
                            {file ? (
                              <>
                                <CheckCircle2 className="w-6 h-6 text-gray-700" />
                                <div className="text-left">
                                  <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-600">Ready to upload</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <Upload className="w-6 h-6 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">
                                  Choose PDF Template
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </label>

                      <button
                        className="sm:w-auto bg-gray-900 hover:bg-gray-800 
                          disabled:bg-gray-400
                          text-white font-semibold px-8 py-3.5 rounded-lg transition-all shadow-sm
                          disabled:cursor-not-allowed
                          flex items-center justify-center gap-2"
                        onClick={uploadTemplate}
                        disabled={!projectId || !file || uploading}
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5" />
                            <span>Upload</span>
                          </>
                        )}
                      </button>
                    </div>

                    {uploadSuccess && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">Template uploaded successfully</span>
                      </div>
                    )}
                  </div>

                  {/* PDF Preview */}
                  {file && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Target className="w-5 h-5 text-gray-600" />
                          Set QR Code Position
                        </h4>
                        {qrPosition && (
                          <div className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                            X: {qrPosition.x} | Y: {qrPosition.y}
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
                        <div
                          onClick={onPageClick}
                          className="relative inline-block border-2 border-gray-300 rounded-lg overflow-hidden cursor-crosshair hover:border-gray-900 transition-all shadow-sm bg-white group"
                        >
                          {/* Simulated PDF Preview */}
                          <div className="w-full bg-white p-12 min-h-[600px] flex items-center justify-center">
                            <div className="text-center space-y-4">
                              <FileText className="w-24 h-24 text-gray-300 mx-auto" />
                              <p className="text-gray-600 font-semibold">PDF Preview</p>
                              <p className="text-sm text-gray-500">Click anywhere to set QR position</p>
                            </div>
                          </div>
                          
                          {/* QR Position Marker */}
                          {qrPosition && (
                            <div 
                              className="absolute w-12 h-12 border-4 border-gray-900 bg-gray-100 rounded-lg flex items-center justify-center"
                              style={{ 
                                left: qrPosition.x - 24, 
                                top: qrPosition.y - 24 
                              }}
                            >
                              <Target className="w-6 h-6 text-gray-900" />
                            </div>
                          )}

                          {/* Crosshair overlay on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Crosshair className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700">
                          <p className="font-semibold mb-1">How to set QR position:</p>
                          <p className="text-gray-600">Click anywhere on the certificate template preview above to set where you want the QR code to appear on the final certificates.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-700" />
                Setup Progress
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 mt-1 ${projectId ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <CheckCircle2 className={`w-4 h-4 ${projectId ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Project Created</p>
                    <p className="text-xs text-gray-600">Basic information set</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 mt-1 ${uploadSuccess ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <Upload className={`w-4 h-4 ${uploadSuccess ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Template Uploaded</p>
                    <p className="text-xs text-gray-600">PDF template ready</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 mt-1 ${qrPosition ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <Target className={`w-4 h-4 ${qrPosition ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">QR Position Set</p>
                    <p className="text-xs text-gray-600">Code placement defined</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-900 rounded-lg p-2">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Quick Facts</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">•</span>
                  <span>Each project can have multiple certificate batches</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">•</span>
                  <span>QR codes are automatically generated for verification</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">•</span>
                  <span>Templates must be in PDF format</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">•</span>
                  <span>Maximum file size: 10MB per template</span>
                </li>
              </ul>
            </div>

            {/* Help Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-700" />
                Need Assistance?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is ready to help you with project setup
              </p>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-4 py-2.5 rounded-lg transition-all text-sm">
                Contact Support
              </button>
            </div>

            {/* Tips Card */}
            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-900 rounded-lg p-2">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">✓</span>
                  <span>Use high-resolution PDF templates for best quality</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">✓</span>
                  <span>Place QR codes in an easily scannable location</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-500 font-bold">✓</span>
                  <span>Test your template with a sample certificate first</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}