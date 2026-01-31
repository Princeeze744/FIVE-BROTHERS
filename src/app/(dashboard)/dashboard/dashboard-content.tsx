'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Star,
  Clock, 
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Phone,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  UserPlus,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Stats {
  totalCustomers: number
  reviewedCustomers: number
  pendingFollowUps: number
  neverReviewed: number
  reviewRate: number
}

interface Customer {
  id: string
  firstName: string
  lastName: string
  phone: string
  product: string
  reviewStatus: string
  followUpStage: number
  createdAt: Date
  deliveryDate: Date
}

interface FollowUp {
  id: string
  stage: number
  dueDate: Date
  customer: Customer
}

interface DashboardContentProps {
  stats: Stats
  pendingFollowUps: FollowUp[]
  recentCustomers: Customer[]
  upcomingFollowUps: FollowUp[]
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning', emoji: '☀️' }
  if (hour < 17) return { text: 'Good afternoon', emoji: '🌤️' }
  return { text: 'Good evening', emoji: '🌙' }
}

function AnimatedNumber({ value, duration = 1200 }: { value: number, duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    let startTime: number
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(Math.floor(easeOut * value))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])
  
  return <>{displayValue}</>
}

function CircularProgress({ percentage }: { percentage: number }) {
  const size = 140
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  const [offset, setOffset] = useState(circumference)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (percentage / 100) * circumference)
    }, 500)
    return () => clearTimeout(timer)
  }, [percentage, circumference])
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3D8B5E" />
            <stop offset="100%" stopColor="#5AAE76" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#EBE6DF"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
        />
      </svg>
      {/* Center text - absolutely positioned */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-baseline justify-center">
            <motion.span 
              className="text-3xl font-bold leading-none"
              style={{ 
                color: '#1E3A5F',
                fontFamily: 'var(--font-display), system-ui, sans-serif'
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            >
              <AnimatedNumber value={percentage} duration={1500} />
            </motion.span>
            <span 
              className="text-base font-semibold ml-0.5 leading-none" 
              style={{ color: '#6B7C8F' }}
            >
              %
            </span>
          </div>
          <span 
            className="text-xs mt-1 leading-none" 
            style={{ color: '#6B7C8F' }}
          >
            Review Rate
          </span>
        </div>
      </div>
    </div>
  )
}

function StageBadge({ stage }: { stage: number }) {
  const stageConfig = {
    1: { bg: 'rgba(59, 130, 160, 0.12)', color: '#3B82A0', label: 'First Reach' },
    2: { bg: 'rgba(230, 162, 60, 0.12)', color: '#E6A23C', label: 'Second Touch' },
    3: { bg: 'rgba(212, 102, 74, 0.12)', color: '#D4664A', label: 'Final Ask' },
  }
  
  const config = stageConfig[stage as keyof typeof stageConfig] || stageConfig[1]
  
  return (
    <motion.span 
      className="px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: config.bg, color: config.color }}
      whileHover={{ scale: 1.05 }}
    >
      {config.label}
    </motion.span>
  )
}

function getRelativeTime(date: Date) {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  
  const actions = [
    { icon: UserPlus, label: 'Add Customer', href: '/dashboard/customers', color: '#1E3A5F' },
    { icon: Send, label: 'Send Message', href: '/dashboard/messages', color: '#3B82A0' },
  ]
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      <AnimatePresence>
        {isOpen && actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
          >
            <Link
              href={action.href}
              className="flex items-center gap-3 pl-4 pr-2 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
              style={{ border: '1px solid #EBE6DF' }}
            >
              <span className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
                {action.label}
              </span>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: action.color }}
              >
                <action.icon size={18} />
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
      
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, #D4915E 0%, #C4814E 100%)',
          boxShadow: '0 8px 24px rgba(212, 145, 94, 0.4)'
        }}
        whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(212, 145, 94, 0.5)' }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Plus size={24} strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}

export function DashboardContent({ 
  stats, 
  pendingFollowUps, 
  recentCustomers,
}: DashboardContentProps) {
  const greeting = getGreeting()
  
  const statCards = [
    {
      label: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: '#1E3A5F',
      bgColor: 'rgba(30, 58, 95, 0.08)',
      glowColor: 'rgba(30, 58, 95, 0.15)'
    },
    {
      label: 'Left Reviews',
      value: stats.reviewedCustomers,
      icon: Star,
      color: '#3D8B5E',
      bgColor: 'rgba(61, 139, 94, 0.08)',
      glowColor: 'rgba(61, 139, 94, 0.15)'
    },
    {
      label: 'Pending Follow-ups',
      value: stats.pendingFollowUps,
      icon: Clock,
      color: '#E6A23C',
      bgColor: 'rgba(230, 162, 60, 0.08)',
      glowColor: 'rgba(230, 162, 60, 0.15)'
    },
    {
      label: 'Never Reviewed',
      value: stats.neverReviewed,
      icon: AlertCircle,
      color: '#C0392B',
      bgColor: 'rgba(192, 57, 43, 0.08)',
      glowColor: 'rgba(192, 57, 43, 0.15)'
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 pb-24">
      <FloatingActionButton />
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="flex items-center gap-3">
          <h1 
            className="text-2xl sm:text-3xl font-semibold"
            style={{ 
              color: '#1E3A5F',
              fontFamily: 'var(--font-display), system-ui, sans-serif'
            }}
          >
            {greeting.text}!
          </h1>
          <motion.span 
            className="text-2xl sm:text-3xl"
            animate={{ 
              rotate: [0, 14, -8, 14, -4, 10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2.5, 
              delay: 0.5,
              ease: "easeInOut",
            }}
          >
            {greeting.emoji}
          </motion.span>
        </div>
        <p className="mt-1.5 text-sm sm:text-base" style={{ color: '#6B7C8F' }}>
          Here is what is happening with your customers today.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ 
              y: -6,
              transition: { duration: 0.2 }
            }}
            className="relative bg-white rounded-2xl p-4 sm:p-6 cursor-default overflow-hidden group"
            style={{ 
              boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
              border: '1px solid #EBE6DF'
            }}
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${stat.glowColor}, transparent 70%)`
              }}
            />
            
            <div className="relative z-10">
              <motion.div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                style={{ backgroundColor: stat.bgColor }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </motion.div>
              <p 
                className="text-2xl sm:text-3xl font-bold"
                style={{ 
                  color: '#1E3A5F',
                  fontFamily: 'var(--font-display), system-ui, sans-serif'
                }}
              >
                <AnimatedNumber value={stat.value} />
              </p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: '#6B7C8F' }}>
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-2 bg-white rounded-2xl overflow-hidden"
          style={{ 
            boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
            border: '1px solid #EBE6DF'
          }}
        >
          <div className="p-4 sm:p-6 border-b" style={{ borderColor: '#EBE6DF' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 
                  className="text-lg font-semibold flex items-center gap-2"
                  style={{ 
                    color: '#1E3A5F',
                    fontFamily: 'var(--font-display), system-ui, sans-serif'
                  }}
                >
                  Pending Follow-ups
                  {stats.pendingFollowUps > 0 && (
                    <motion.span 
                      className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: '#E6A23C' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.6 }}
                    >
                      {stats.pendingFollowUps}
                    </motion.span>
                  )}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#6B7C8F' }}>
                  Customers due for follow-up today
                </p>
              </div>
              <Link 
                href="/dashboard/customers?filter=pending"
                className="text-sm font-medium flex items-center gap-1 transition-all duration-150 hover:gap-2"
                style={{ color: '#D4915E' }}
              >
                View all
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="divide-y" style={{ borderColor: '#EBE6DF' }}>
            {pendingFollowUps.length === 0 ? (
              <motion.div 
                className="p-8 sm:p-12 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#E8F5ED' }}
                  animate={{ 
                    boxShadow: ['0 0 0 0 rgba(61, 139, 94, 0.2)', '0 0 0 20px rgba(61, 139, 94, 0)', '0 0 0 0 rgba(61, 139, 94, 0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <CheckCircle2 size={40} style={{ color: '#3D8B5E' }} />
                </motion.div>
                <p className="font-semibold text-lg" style={{ color: '#1E3A5F' }}>
                  All caught up!
                </p>
                <p className="text-sm mt-1" style={{ color: '#6B7C8F' }}>
                  No pending follow-ups for today.
                </p>
              </motion.div>
            ) : (
              pendingFollowUps.map((followUp, index) => (
                <motion.div
                  key={followUp.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="p-4 sm:px-6 flex items-center gap-4 hover:bg-gradient-to-r hover:from-transparent hover:to-[rgba(30,58,95,0.02)] transition-all duration-200 cursor-pointer group"
                >
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                    style={{ 
                      background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)'
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {followUp.customer.firstName.charAt(0)}{followUp.customer.lastName.charAt(0)}
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: '#1E3A5F' }}>
                      {followUp.customer.firstName} {followUp.customer.lastName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs truncate" style={{ color: '#6B7C8F' }}>
                        {followUp.customer.product}
                      </span>
                      <span style={{ color: '#EBE6DF' }}>•</span>
                      <span className="text-xs flex items-center gap-1" style={{ color: '#6B7C8F' }}>
                        <Phone size={12} />
                        {followUp.customer.phone}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <StageBadge stage={followUp.stage} />
                    <motion.button
                      className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ 
                        background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)'
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 4px 12px rgba(30, 58, 95, 0.3)'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageSquare size={14} />
                      Send
                    </motion.button>
                    <ChevronRight 
                      size={18} 
                      className="opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-150"
                      style={{ color: '#6B7C8F' }}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="bg-white rounded-2xl p-6 relative overflow-hidden"
          style={{ 
            boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
            border: '1px solid #EBE6DF'
          }}
        >
          <div 
            className="absolute top-0 right-0 w-32 h-32 opacity-50"
            style={{
              background: 'radial-gradient(circle, rgba(61, 139, 94, 0.1), transparent 70%)'
            }}
          />
          
          <h2 
            className="text-lg font-semibold mb-6 relative z-10"
            style={{ 
              color: '#1E3A5F',
              fontFamily: 'var(--font-display), system-ui, sans-serif'
            }}
          >
            Review Rate
          </h2>
          
          <div className="flex flex-col items-center relative z-10">
            <CircularProgress percentage={stats.reviewRate} />
            
            <div className="mt-6 w-full space-y-3">
              <motion.div 
                className="flex items-center justify-between text-sm p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(61, 139, 94, 0.06)' }}
                whileHover={{ backgroundColor: 'rgba(61, 139, 94, 0.1)' }}
              >
                <span className="flex items-center gap-2" style={{ color: '#6B7C8F' }}>
                  <CheckCircle2 size={16} style={{ color: '#3D8B5E' }} />
                  Reviewed
                </span>
                <span className="font-semibold" style={{ color: '#3D8B5E' }}>
                  {stats.reviewedCustomers}
                </span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-between text-sm p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(230, 162, 60, 0.06)' }}
                whileHover={{ backgroundColor: 'rgba(230, 162, 60, 0.1)' }}
              >
                <span className="flex items-center gap-2" style={{ color: '#6B7C8F' }}>
                  <Clock size={16} style={{ color: '#E6A23C' }} />
                  Pending
                </span>
                <span className="font-semibold" style={{ color: '#E6A23C' }}>
                  {stats.totalCustomers - stats.reviewedCustomers - stats.neverReviewed}
                </span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-between text-sm p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(192, 57, 43, 0.06)' }}
                whileHover={{ backgroundColor: 'rgba(192, 57, 43, 0.1)' }}
              >
                <span className="flex items-center gap-2" style={{ color: '#6B7C8F' }}>
                  <XCircle size={16} style={{ color: '#C0392B' }} />
                  No Review
                </span>
                <span className="font-semibold" style={{ color: '#C0392B' }}>
                  {stats.neverReviewed}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="bg-white rounded-2xl overflow-hidden"
        style={{ 
          boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
          border: '1px solid #EBE6DF'
        }}
      >
        <div className="p-4 sm:p-6 border-b" style={{ borderColor: '#EBE6DF' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 
                className="text-lg font-semibold flex items-center gap-2"
                style={{ 
                  color: '#1E3A5F',
                  fontFamily: 'var(--font-display), system-ui, sans-serif'
                }}
              >
                Recent Customers
                <Sparkles size={18} style={{ color: '#D4915E' }} />
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#6B7C8F' }}>
                Latest customers added to the system
              </p>
            </div>
            <Link 
              href="/dashboard/customers"
              className="text-sm font-medium flex items-center gap-1 transition-all duration-150 hover:gap-2"
              style={{ color: '#D4915E' }}
            >
              View all
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F5F1EB' }}>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: '#6B7C8F' }}>
                  Customer
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: '#6B7C8F' }}>
                  Product
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: '#6B7C8F' }}>
                  Added
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: '#6B7C8F' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#EBE6DF' }}>
              {recentCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                        style={{ backgroundColor: '#F5F1EB' }}
                      >
                        <Users size={28} style={{ color: '#6B7C8F' }} />
                      </div>
                      <p className="font-medium" style={{ color: '#1E3A5F' }}>No customers yet</p>
                      <p className="text-sm mt-1" style={{ color: '#6B7C8F' }}>
                        Add your first customer to get started
                      </p>
                      <Link
                        href="/dashboard/customers"
                        className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{ backgroundColor: '#1E3A5F' }}
                      >
                        Add Customer
                      </Link>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                recentCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="hover:bg-gradient-to-r hover:from-transparent hover:to-[rgba(30,58,95,0.02)] transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                        </motion.div>
                        <div>
                          <p className="font-medium text-sm" style={{ color: '#1E3A5F' }}>
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-xs" style={{ color: '#6B7C8F' }}>
                            {customer.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: '#1E3A5F' }}>
                        {customer.product}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: '#6B7C8F' }}>
                        {getRelativeTime(customer.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {customer.reviewStatus === 'LEFT_REVIEW' ? (
                        <motion.span 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: 'rgba(61, 139, 94, 0.1)', color: '#3D8B5E' }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <CheckCircle2 size={12} />
                          Reviewed
                        </motion.span>
                      ) : customer.followUpStage >= 3 ? (
                        <motion.span 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)', color: '#C0392B' }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <XCircle size={12} />
                          No Review
                        </motion.span>
                      ) : (
                        <StageBadge stage={customer.followUpStage || 1} />
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y" style={{ borderColor: '#EBE6DF' }}>
          {recentCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3"
                style={{ backgroundColor: '#F5F1EB' }}
              >
                <Users size={28} style={{ color: '#6B7C8F' }} />
              </div>
              <p className="font-medium" style={{ color: '#1E3A5F' }}>No customers yet</p>
              <Link
                href="/dashboard/customers"
                className="mt-4 inline-block px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: '#1E3A5F' }}
              >
                Add Customer
              </Link>
            </div>
          ) : (
            recentCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
                    >
                      {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: '#1E3A5F' }}>
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B7C8F' }}>
                        {customer.product}
                      </p>
                    </div>
                  </div>
                  {customer.reviewStatus === 'LEFT_REVIEW' ? (
                    <CheckCircle2 size={20} style={{ color: '#3D8B5E' }} />
                  ) : (
                    <StageBadge stage={customer.followUpStage || 1} />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}