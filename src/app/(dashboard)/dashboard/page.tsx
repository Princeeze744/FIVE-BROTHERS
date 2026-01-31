'use client'

import { useEffect, useState } from 'react'
import { DashboardContent } from './dashboard-content'
import { motion } from 'framer-motion'

interface DashboardData {
  stats: {
    totalCustomers: number
    reviewedCustomers: number
    pendingFollowUps: number
    neverReviewed: number
    reviewRate: number
  }
  pendingFollowUps: any[]
  recentCustomers: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard')
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(String(err))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Header Skeleton */}
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 rounded-lg animate-pulse mt-2" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 sm:p-6"
              style={{ 
                boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
                border: '1px solid #EBE6DF'
              }}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl animate-pulse mb-4" />
              <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-24 bg-gray-100 rounded-lg animate-pulse mt-2" />
            </motion.div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div 
            className="lg:col-span-2 bg-white rounded-2xl p-6 h-64"
            style={{ 
              boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
              border: '1px solid #EBE6DF'
            }}
          >
            <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-56 bg-gray-100 rounded-lg animate-pulse mt-2" />
          </div>
          <div 
            className="bg-white rounded-2xl p-6 h-64"
            style={{ 
              boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
              border: '1px solid #EBE6DF'
            }}
          >
            <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)' }}
        >
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="font-medium" style={{ color: '#1E3A5F' }}>
          Failed to load dashboard
        </p>
        <p className="text-sm mt-1" style={{ color: '#6B7C8F' }}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: '#1E3A5F' }}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <DashboardContent 
      stats={data.stats}
      pendingFollowUps={data.pendingFollowUps}
      recentCustomers={data.recentCustomers}
      upcomingFollowUps={[]}
    />
  )
}