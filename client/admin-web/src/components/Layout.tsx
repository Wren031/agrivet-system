import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import ToastContainer from './ToastContainer'
import { useApp } from '../context/AppContext'

export default function Layout() {
  const { sidebarOpen, setSidebarOpen } = useApp()

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-surface-950/40 backdrop-blur-[2px] z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
