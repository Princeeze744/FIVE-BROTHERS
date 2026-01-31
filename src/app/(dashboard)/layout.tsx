'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Templates', href: '/dashboard/templates', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (status === 'loading' || !mounted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#FDFBF8' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.03, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          >
            <Image
              src="/logo.png"
              alt="Five Brothers Appliance"
              width={160}
              height={100}
              className="w-32 h-auto object-contain"
              style={{
                filter: 'drop-shadow(0 4px 12px rgba(30, 58, 95, 0.1))'
              }}
              priority
            />
          </motion.div>
          
          <div className="flex flex-col items-center gap-3">
            <motion.div 
              className="flex gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#1E3A5F' }}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm font-medium"
              style={{ color: '#6B7C8F' }}
            >
              Loading your dashboard...
            </motion.p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#FDFBF8' }}
    >
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || typeof window !== 'undefined') && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: sidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : -280) }}
            className={`fixed top-0 left-0 h-full w-[280px] z-50 lg:z-30 flex flex-col
                       ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            style={{ 
              backgroundColor: '#FFFFFF',
              boxShadow: '4px 0 24px rgba(30, 58, 95, 0.06)',
              borderRight: '1px solid #EBE6DF'
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Logo Section */}
            <div className="p-4 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Five Brothers Appliance"
                  width={140}
                  height={70}
                  className="w-[110px] h-auto object-contain"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(30, 58, 95, 0.08))'
                  }}
                  priority
                />
              </Link>
              
              {/* Mobile close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-xl transition-colors duration-150 hover:bg-gray-100"
                style={{ color: '#6B7C8F' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* CRM Badge */}
            <div className="px-4 pb-4">
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ 
                  backgroundColor: 'rgba(30, 58, 95, 0.04)',
                  border: '1px solid rgba(30, 58, 95, 0.06)'
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#3D8B5E' }}
                />
                <span 
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: '#6B7C8F' }}
                >
                  CRM System
                </span>
              </div>
            </div>

            {/* Divider */}
            <div 
              className="h-px mx-4 mb-2"
              style={{ backgroundColor: '#EBE6DF' }}
            />

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group relative`}
                      style={{
                        backgroundColor: isActive ? 'rgba(30, 58, 95, 0.08)' : 'transparent',
                        color: isActive ? '#1E3A5F' : '#6B7C8F',
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                          style={{ backgroundColor: '#1E3A5F' }}
                          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        />
                      )}
                      
                      <item.icon 
                        size={20} 
                        strokeWidth={isActive ? 2.5 : 2}
                        className="transition-transform duration-150 group-hover:scale-110"
                      />
                      <span 
                        className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}
                      >
                        {item.name}
                      </span>
                      
                      <ChevronRight 
                        size={16} 
                        className="ml-auto opacity-0 -translate-x-2 transition-all duration-150 group-hover:opacity-50 group-hover:translate-x-0"
                      />
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* User section */}
            <div 
              className="p-4 border-t"
              style={{ borderColor: '#EBE6DF' }}
            >
              <div 
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: '#F5F1EB' }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ 
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)',
                    boxShadow: '0 2px 8px rgba(30, 58, 95, 0.25)'
                  }}
                >
                  {session.user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-sm font-medium truncate"
                    style={{ color: '#1E3A5F' }}
                  >
                    {session.user?.name || 'User'}
                  </p>
                  <p 
                    className="text-xs truncate"
                    style={{ color: '#6B7C8F' }}
                  >
                    {session.user?.email}
                  </p>
                </div>
                <motion.button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="p-2 rounded-lg transition-colors duration-150"
                  style={{ color: '#C0392B' }}
                  whileHover={{ backgroundColor: 'rgba(192, 57, 43, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  title="Sign out"
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="lg:pl-[280px]">
        {/* Top header */}
        <header 
          className="sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-4"
          style={{ 
            backgroundColor: 'rgba(253, 251, 248, 0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #EBE6DF'
          }}
        >
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <motion.button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl transition-colors duration-150"
              style={{ color: '#1E3A5F' }}
              whileHover={{ backgroundColor: 'rgba(30, 58, 95, 0.08)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={24} />
            </motion.button>

            {/* Page title - shows on mobile */}
            <h1 
              className="lg:hidden text-lg font-semibold"
              style={{ 
                color: '#1E3A5F',
                fontFamily: 'var(--font-display), system-ui, sans-serif'
              }}
            >
              {navigation.find(n => pathname.startsWith(n.href))?.name || 'Dashboard'}
            </h1>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notifications */}
              <motion.button
                className="relative p-2 sm:p-2.5 rounded-xl transition-colors duration-150"
                style={{ color: '#6B7C8F' }}
                whileHover={{ 
                  backgroundColor: 'rgba(30, 58, 95, 0.08)',
                  color: '#1E3A5F'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell size={20} />
                <motion.span 
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#D4915E' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>

              {/* User avatar - desktop */}
              <div 
                className="hidden sm:flex items-center gap-3 pl-4 border-l"
                style={{ borderColor: '#EBE6DF' }}
              >
                <div className="text-right">
                  <p 
                    className="text-sm font-medium"
                    style={{ color: '#1E3A5F' }}
                  >
                    {session.user?.name || 'User'}
                  </p>
                  <p 
                    className="text-xs"
                    style={{ color: '#6B7C8F' }}
                  >
                    {(session.user as any)?.role || 'Staff'}
                  </p>
                </div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ 
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)',
                    boxShadow: '0 4px 12px rgba(30, 58, 95, 0.2)'
                  }}
                >
                  {session.user?.name?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}