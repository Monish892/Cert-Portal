import { useEffect, useState } from 'react'
import { 
  Download, RefreshCw, Eye, Loader2, Search, Activity, 
  CheckCircle2, XCircle, Clock, AlertCircle, TrendingUp, Package, 
  Zap, X, BarChart3, FileArchive
} from 'lucide-react'

export default function Dashboard() {
  const [batchId, setBatchId] = useState('')
  const [batch, setBatch] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [realtimeStatus, setRealtimeStatus] = useState('Connected')

  useEffect(() => {
    const interval = setInterval(() => {
      if (batch) setRealtimeStatus('Active')
    }, 5000)
    return () => clearInterval(interval)
  }, [batch])

  const load = async () => {
    if (!batchId) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:4000/api/batch/status/${batchId}`)
      const data = await res.json()
      setBatch(data)
      showToast('Batch loaded successfully!')
    } catch (e) {
      alert('Failed to load batch')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setSuccessMessage(msg)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 4000)
  }

  const download = () => {
    if (!batchId) return alert('Enter batch ID')
    window.location.href = `http://localhost:4000/api/batch/download-issued/${batchId}`
    showToast('Download started!')
  }

  const view = (url) => {
    window.open(`http://localhost:4000${url}`, '_blank')
  }

  const retry = async () => {
    if (!batchId) return
    await fetch('http://localhost:4000/api/batch/start-issuance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchId })
    })
    showToast('Retry started!')
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'issued': return <CheckCircle2 className="w-4 h-4" />
      case 'processing': return <Loader2 className="w-4 h-4 animate-spin" />
      case 'failed': return <XCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const issuedCount = batch?.results?.filter(r => r.status === 'issued').length || 0
  const failedCount = batch?.results?.filter(r => r.status === 'failed').length || 0
  const pendingCount = batch?.results?.filter(r => r.status === 'pending').length || 0
  const processingCount = batch?.results?.filter(r => r.status === 'processing').length || 0

  return (
    <div className='min-h-screen bg-gray-50'>

      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3 min-w-80">
            <div className="bg-gray-100 rounded-full p-2">
              <CheckCircle2 className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Success</p>
              <p className="text-xs text-gray-600">{successMessage}</p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-900 rounded-lg p-3">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Issuance Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Step 3: Monitor and manage your certificate batches</p>
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
              <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-semibold">✓</div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">Upload</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-700"></div>
            <div className="flex items-center">
              <div className="bg-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-semibold">3</div>
              <span className="ml-2 text-sm font-medium text-gray-900 hidden sm:inline">Process</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className='bg-white shadow-sm border border-gray-200 rounded-lg mb-6'>
          <div className='bg-gray-900 text-white p-6 rounded-t-lg'>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Batch Lookup</h2>
                <p className='text-gray-300 text-sm'>Enter batch ID to monitor status and download certificates</p>
              </div>
              <Search className="w-10 h-10 opacity-70" />
            </div>
          </div>

          <div className='p-6 sm:p-8'>
            <div className='flex flex-col sm:flex-row gap-3'>
              <input
                placeholder='Enter batch ID to load status...'
                value={batchId}
                onChange={e => setBatchId(e.target.value)}
                className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all'
                onKeyDown={e => e.key === 'Enter' && load()}
              />
              <button
                onClick={load}
                disabled={loading || !batchId}
                className='bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap shadow-sm hover:shadow-md'
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Load Batch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {batch && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Stat label="Issued" value={issuedCount} icon={<CheckCircle2 className="w-4 h-4" />} />
            <Stat label="Failed" value={failedCount} icon={<XCircle className="w-4 h-4" />} />
            <Stat label="Processing" value={processingCount} icon={<Loader2 className="w-4 h-4" />} />
            <Stat label="Pending" value={pendingCount} icon={<Clock className="w-4 h-4" />} />
          </div>
        )}

        {/* Batch Overview */}
        {batch && (
          <div className='bg-white border border-gray-200 shadow-sm rounded-lg mb-6'>
            <div className='bg-gray-900 text-white p-6 rounded-t-lg'>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Batch Overview</h2>
                  <p className="text-gray-300 text-sm">Detailed status and quick actions</p>
                </div>
                <Package className="w-10 h-10 opacity-70" />
              </div>
            </div>

            <div className='p-6 sm:p-8'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Box label="Batch ID" value={batch._id || batch.id} icon={<Package className="w-4 h-4" />} />
                <Box label="Status" value={batch.status} icon={<Activity className="w-4 h-4" />} status />
                <Box label="Progress" value={`${issuedCount} / ${batch.validCount || 0}`} icon={<TrendingUp className="w-4 h-4" />} progress={batch.validCount ? (issuedCount / batch.validCount * 100) : 0} />
                <DownloadSection onClick={download} />
              </div>
            </div>
          </div>
        )}

        {/* Certificate Results */}
        {batch && (
          <div className='bg-white border border-gray-200 shadow-sm rounded-lg'>
            <div className='p-6 border-b border-gray-200 bg-gray-50'>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
                    <BarChart3 className="w-5 h-5 text-gray-700" />
                    Certificate Results
                  </h3>
                  <p className='text-sm text-gray-600 mt-1'>Detailed status for each certificate in the batch</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-sm font-semibold text-gray-700">
                    Total: {batch.results?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <Th>#</Th>
                    <Th>Filename</Th>
                    <Th center>Status</Th>
                    <Th right>Actions</Th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-gray-200'>
                  {batch.results && batch.results.map((r, i) => (
                    <tr key={i} className='hover:bg-gray-50 transition-colors'>
                      <Td>{i + 1}</Td>
                      <Td>{r.filename}</Td>
                      <Td center>
                        <StatusBadge status={r.status} icon={getStatusIcon(r.status)} />
                      </Td>
                      <Td right>
                        <div className="flex justify-end gap-2">
                          {r.url && <ActionBtn onClick={() => view(r.url)} icon={<Eye className="w-4 h-4" />} label="View" />}
                          <ActionBtn onClick={retry} icon={<RefreshCw className="w-4 h-4" />} label="Retry" />
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className='md:hidden divide-y divide-gray-200'>
              {batch.results && batch.results.map((r, i) => (
                <div key={i} className='p-5 space-y-4 hover:bg-gray-50 transition-colors'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="bg-gray-100 rounded-lg px-2 py-1 flex-shrink-0">
                        <span className="text-xs font-bold text-gray-700">#{i + 1}</span>
                      </div>
                      <div className='font-semibold text-gray-900 text-sm break-all flex-1'>{r.filename}</div>
                    </div>
                    <StatusBadge status={r.status} icon={getStatusIcon(r.status)} />
                  </div>

                  <div className='grid grid-cols-2 gap-2'>
                    {r.url && <MobileBtn text="View" icon={<Eye className="w-5 h-5" />} onClick={() => view(r.url)} />}
                    <MobileBtn text="Retry" icon={<RefreshCw className="w-5 h-5" />} onClick={retry} />
                  </div>
                </div>
              ))}
            </div>

            {batch.results && batch.results.length === 0 && (
              <div className='px-6 py-16 text-center'>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Available</h3>
                <p className='text-gray-500'>This batch doesn't have any results yet</p>
              </div>
            )}
          </div>
        )}

        {!batch && !loading && (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className="bg-gray-50 p-16 text-center rounded-lg">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-lg shadow-sm mb-6">
                <Search className='w-12 h-12 text-gray-400' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-3'>No Batch Loaded</h3>
              <p className='text-gray-600 mb-6 max-w-md mx-auto'>Enter a batch ID in the search box above to view detailed status, monitor progress, and manage certificates</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Zap className="w-4 h-4" />
                <span>Real-time updates enabled</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}

/* ---------- Helper Components ---------- */

const Th = ({ children, center, right }) => (
  <th className={`px-6 py-4 text-xs font-semibold uppercase text-gray-700 ${center ? 'text-center' : right ? 'text-right' : 'text-left'}`}>{children}</th>
)

const Td = ({ children, center, right }) => (
  <td className={`px-6 py-4 text-sm text-gray-900 ${center ? 'text-center' : right ? 'text-right' : 'text-left'} ${!center && !right ? 'font-medium' : ''}`}>{children}</td>
)

const StatusBadge = ({ status, icon }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border bg-gray-100 text-gray-700 border-gray-200">
    {icon} {status}
  </span>
)

const ActionBtn = ({ onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-all text-sm shadow-sm hover:shadow-md"
  >
    {icon} {label}
  </button>
)

const MobileBtn = ({ onClick, icon, text }) => (
  <button 
    onClick={onClick}
    className="inline-flex flex-col items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-3 rounded-lg transition-all text-xs shadow-sm"
  >
    {icon}
    <span>{text}</span>
  </button>
)

const Stat = ({ label, value, icon }) => (
  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all">
    <div className="flex items-center gap-2 mb-2">
      <div className="bg-gray-200 rounded-lg p-2">
        {icon}
      </div>
      <span className="text-xs font-semibold text-gray-600 uppercase">{label}</span>
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
)

const Box = ({ label, value, icon, status, progress }) => (
  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
    <div className="flex items-center gap-2 mb-3">
      <div className="bg-gray-200 rounded-lg p-2 text-gray-700">
        {icon}
      </div>
      <span className="text-xs font-semibold uppercase text-gray-600">{label}</span>
    </div>
    
    {status ? (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border bg-gray-100 text-gray-700 border-gray-200">
        <Activity className="w-4 h-4" />
        {value}
      </span>
    ) : (
      <div className="text-sm font-bold text-gray-900 truncate">{value}</div>
    )}

    {progress !== undefined && (
      <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className="bg-gray-900 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>
    )}
  </div>
)

const DownloadSection = ({ onClick }) => (
  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
    <div className="flex items-center gap-2 mb-3">
      <div className="bg-gray-200 rounded-lg p-2">
        <Download className="w-4 h-4 text-gray-700" />
      </div>
      <span className="text-xs font-semibold uppercase text-gray-600">Download</span>
    </div>

    <button
      onClick={onClick}
      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
    >
      <Download className="w-4 h-4" />
      <span>Download ZIP</span>
    </button>
  </div>
)