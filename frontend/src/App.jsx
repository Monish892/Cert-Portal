import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Step1 from './pages/Step1'
import Step2 from './pages/Step2'
import Dashboard from './pages/Dashboard'

function Navigation() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 sm:space-x-4 py-5 overflow-x-auto">
            <Link 
              to='/'
              className={`relative px-5 py-2.5 text-sm sm:text-base font-semibold rounded-lg whitespace-nowrap transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-white text-slate-900 shadow-lg shadow-white/20 scale-105' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-105'
              }`}
            >
              <span className="relative z-10">Step 1</span>
              {isActive('/') && (
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm"></span>
              )}
            </Link>
            <Link 
              to='/batch'
              className={`relative px-5 py-2.5 text-sm sm:text-base font-semibold rounded-lg whitespace-nowrap transition-all duration-300 ${
                isActive('/batch') 
                  ? 'bg-white text-slate-900 shadow-lg shadow-white/20 scale-105' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-105'
              }`}
            >
              <span className="relative z-10">Step 2</span>
              {isActive('/batch') && (
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm"></span>
              )}
            </Link>
            <Link 
              to='/dashboard'
              className={`relative px-5 py-2.5 text-sm sm:text-base font-semibold rounded-lg whitespace-nowrap transition-all duration-300 ${
                isActive('/dashboard') 
                  ? 'bg-white text-slate-900 shadow-lg shadow-white/20 scale-105' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-105'
              }`}
            >
              <span className="relative z-10">Dashboard</span>
              {isActive('/dashboard') && (
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm"></span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path='/' element={<Step1/>}/>
          <Route path='/batch' element={<Step2/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  )
}