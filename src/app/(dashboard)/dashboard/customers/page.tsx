'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronRight, 
  Phone, 
  Mail,
  MapPin,
  Package,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  User,
  FileText,
  Download,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface Customer {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string | null
  address: string
  city: string
  purchaseDate: string
  deliveryDate: string
  product: string
  specialNote: string | null
  reviewStatus: string
  reviewPlatform: string | null
  followUpStage: number
  createdAt: string
  followUps: { id: string; stage: number; status: string; dueDate: string }[]
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Stage badge component
function StageBadge({ stage, reviewStatus }: { stage: number, reviewStatus: string }) {
  if (reviewStatus === 'LEFT_REVIEW') {
    return (
      <span 
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: 'rgba(61, 139, 94, 0.1)', color: '#3D8B5E' }}
      >
        <CheckCircle2 size={12} />
        Reviewed
      </span>
    )
  }
  
  if (stage >= 3) {
    return (
      <span 
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)', color: '#C0392B' }}
      >
        <XCircle size={12} />
        No Review
      </span>
    )
  }

  const stageConfig = {
    0: { bg: 'rgba(107, 124, 143, 0.1)', color: '#6B7C8F', label: 'New' },
    1: { bg: 'rgba(59, 130, 160, 0.12)', color: '#3B82A0', label: 'First Reach' },
    2: { bg: 'rgba(230, 162, 60, 0.12)', color: '#E6A23C', label: 'Second Touch' },
  }
  
  const config = stageConfig[stage as keyof typeof stageConfig] || stageConfig[0]
  
  return (
    <span 
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <Clock size={12} />
      {config.label}
    </span>
  )
}

// Add Customer Modal
function AddCustomerModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    purchaseDate: '',
    deliveryDate: '',
    product: '',
    specialNote: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create customer')
      }

      toast.success('Customer added successfully!')
      onSuccess()
      onClose()
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        purchaseDate: '',
        deliveryDate: '',
        product: '',
        specialNote: ''
      })
    } catch {
        toast.error('Failed to create customer')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          style={{ boxShadow: '0 24px 48px rgba(30, 58, 95, 0.2)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: '#EBE6DF' }}
          >
            <div>
              <h2 
                className="text-xl font-semibold"
                style={{ 
                  color: '#1E3A5F',
                  fontFamily: 'var(--font-display), system-ui, sans-serif'
                }}
              >
                Add New Customer
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#6B7C8F' }}>
                Enter customer details to start tracking follow-ups
              </p>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-xl transition-colors"
              style={{ color: '#6B7C8F' }}
              whileHover={{ backgroundColor: 'rgba(30, 58, 95, 0.08)' }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  First Name *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7C8F' }} />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
                    style={{
                      backgroundColor: '#F5F1EB',
                      border: '2px solid transparent',
                      color: '#1E3A5F'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    placeholder="John"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Last Name *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7C8F' }} />
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
                    style={{
                      backgroundColor: '#F5F1EB',
                      border: '2px solid transparent',
                      color: '#1E3A5F'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7C8F' }} />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
                    style={{
                      backgroundColor: '#F5F1EB',
                      border: '2px solid transparent',
                      color: '#1E3A5F'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    placeholder="(214) 555-0123"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7C8F' }} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
                    style={{
                      backgroundColor: '#F5F1EB',
                      border: '2px solid transparent',
                      color: '#1E3A5F'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Address *
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7C8F' }} />
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
                    style={{
                      backgroundColor: '#F5F1EB',
                      border: '2px solid transparent',
                      color: '#1E3A5F'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    placeholder="123 Main Street"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-150"
                  style={{
                    backgroundColor: '#F5F1EB',
                    border: '2px solid transparent',
                    color: '#1E3A5F'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  placeholder="Dallas"
                />
              </div>

              {/* Product */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Product *
                </label>
                <div className="relative">
                  <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7C8F' }} />
                  <input
                    type="text"
                    required
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
                    style={{
                      backgroundColor: '#F5F1EB',
                      border: '2px solid transparent',
                      color: '#1E3A5F'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    placeholder="Samsung Refrigerator"
                  />
                </div>
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Purchase Date *
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7C8F' }} />
                  <input
                    type="date"
                    required
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
                    style={{
                      backgroundColor: '#F5F1EB',
                      border: '2px solid transparent',
                      color: '#1E3A5F'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                </div>
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Delivery Date *
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7C8F' }} />
                  <input
                    type="date"
                    required
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
                    style={{
                      backgroundColor: '#F5F1EB',
                      border: '2px solid transparent',
                      color: '#1E3A5F'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                </div>
              </div>

              {/* Special Note */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Special Note (Optional)
                </label>
                <div className="relative">
                  <FileText size={18} className="absolute left-3 top-3" style={{ color: '#6B7C8F' }} />
                  <textarea
                    value={formData.specialNote}
                    onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-150 resize-none"
                    style={{
                      backgroundColor: '#F5F1EB',
                      border: '2px solid transparent',
                      color: '#1E3A5F'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    placeholder="Any special notes about this customer..."
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: '#EBE6DF' }}>
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-semibold transition-colors"
                style={{ 
                  backgroundColor: '#F5F1EB',
                  color: '#1E3A5F'
                }}
                whileHover={{ backgroundColor: '#EBE6DF' }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)'
                }}
                whileHover={{ boxShadow: '0 8px 20px rgba(30, 58, 95, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add Customer
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        filter,
        page: '1',
        limit: '20'
      })
      const res = await fetch(`/api/customers?${params}`)
      const data = await res.json()
      setCustomers(data.customers || [])
      setPagination(data.pagination)
    } catch {
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [search, filter])

  useEffect(() => {
    const debounce = setTimeout(fetchCustomers, 300)
    return () => clearTimeout(debounce)
  }, [fetchCustomers])

  // Export to CSV function
  const handleExportCSV = async () => {
    setExporting(true)
    try {
      // Fetch all customers for export
      const res = await fetch('/api/customers?limit=1000')
      const data = await res.json()
      const exportData = data.customers || []

      if (exportData.length === 0) {
        toast.error('No customers to export')
        return
      }

      // Define CSV headers
      const headers = [
        'First Name',
        'Last Name',
        'Phone',
        'Email',
        'Address',
        'City',
        'Product',
        'Purchase Date',
        'Delivery Date',
        'Follow-up Stage',
        'Review Status',
        'Review Platform',
        'Special Note',
        'Created At'
      ]

      // Convert customers to CSV rows
      const rows = exportData.map((customer: Customer) => [
        customer.firstName,
        customer.lastName,
        customer.phone,
        customer.email || '',
        customer.address,
        customer.city,
        customer.product,
        format(new Date(customer.purchaseDate), 'yyyy-MM-dd'),
        format(new Date(customer.deliveryDate), 'yyyy-MM-dd'),
        customer.followUpStage,
        customer.reviewStatus === 'LEFT_REVIEW' ? 'Reviewed' : customer.followUpStage >= 3 ? 'No Review' : 'Pending',
        customer.reviewPlatform || '',
        customer.specialNote || '',
        format(new Date(customer.createdAt), 'yyyy-MM-dd HH:mm')
      ])

      // Build CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map((row: any[]) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `five-brothers-customers-${format(new Date(), 'yyyy-MM-dd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(`Exported ${exportData.length} customers!`)
    } catch {
      toast.error('Failed to export customers')
    } finally {
      setExporting(false)
    }
  }

  const filters = [
    { value: 'all', label: 'All Customers' },
    { value: 'pending', label: 'Pending Follow-up' },
    { value: 'reviewed', label: 'Left Review' },
    { value: 'no-review', label: 'No Review (3+ attempts)' }
  ]

  return (
    <div className="space-y-6">
      {/* Add Customer Modal */}
      <AddCustomerModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchCustomers}
      />

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 
            className="text-2xl sm:text-3xl font-semibold"
            style={{ 
              color: '#1E3A5F',
              fontFamily: 'var(--font-display), system-ui, sans-serif'
            }}
          >
            Customers
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#6B7C8F' }}>
            {pagination?.total || 0} total customers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Button */}
          <motion.button
            onClick={handleExportCSV}
            disabled={exporting || loading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold"
            style={{ 
              backgroundColor: '#F5F1EB',
              color: '#1E3A5F'
            }}
            whileHover={{ backgroundColor: '#EBE6DF' }}
            whileTap={{ scale: 0.98 }}
          >
            {exporting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            <span className="hidden sm:inline">Export CSV</span>
          </motion.button>

          {/* Add Customer Button */}
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white"
            style={{ 
              background: 'linear-gradient(135deg, #D4915E 0%, #C4814E 100%)',
              boxShadow: '0 4px 12px rgba(212, 145, 94, 0.3)'
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 20px rgba(212, 145, 94, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Customer</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-4 sm:p-6"
        style={{ 
          boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
          border: '1px solid #EBE6DF'
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B7C8F' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers by name, phone, product..."
              className="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
              style={{
                backgroundColor: '#F5F1EB',
                border: '2px solid transparent',
                color: '#1E3A5F'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B7C8F' }} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-11 pr-10 py-3 rounded-xl outline-none appearance-none cursor-pointer transition-all duration-150 min-w-[200px]"
              style={{
                backgroundColor: '#F5F1EB',
                border: '2px solid transparent',
                color: '#1E3A5F'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
            >
              {filters.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" style={{ color: '#6B7C8F' }} />
          </div>
        </div>
      </motion.div>

      {/* Customers List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl overflow-hidden"
        style={{ 
          boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
          border: '1px solid #EBE6DF'
        }}
      >
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="h-8 bg-gray-100 rounded-full w-24" />
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <motion.div 
            className="p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#F5F1EB' }}
            >
              <User size={36} style={{ color: '#6B7C8F' }} />
            </div>
            <p className="font-semibold text-lg" style={{ color: '#1E3A5F' }}>
              {search || filter !== 'all' ? 'No customers found' : 'No customers yet'}
            </p>
            <p className="text-sm mt-1" style={{ color: '#6B7C8F' }}>
              {search || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Add your first customer to get started'}
            </p>
            {!search && filter === 'all' && (
              <motion.button
                onClick={() => setShowAddModal(true)}
                className="mt-6 px-6 py-3 rounded-xl font-semibold text-white"
                style={{ backgroundColor: '#1E3A5F' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add First Customer
              </motion.button>
            )}
          </motion.div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F5F1EB' }}>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: '#6B7C8F' }}>
                      Customer
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: '#6B7C8F' }}>
                      Contact
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: '#6B7C8F' }}>
                      Product
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: '#6B7C8F' }}>
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold uppercase tracking-wider px-6 py-4" style={{ color: '#6B7C8F' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#EBE6DF' }}>
                  {customers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gradient-to-r hover:from-transparent hover:to-[rgba(30,58,95,0.02)] transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                            style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                          </motion.div>
                          <div>
                            <p className="font-medium" style={{ color: '#1E3A5F' }}>
                              {customer.firstName} {customer.lastName}
                            </p>
                            <p className="text-xs flex items-center gap-1" style={{ color: '#6B7C8F' }}>
                              <MapPin size={12} />
                              {customer.city}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-1.5" style={{ color: '#1E3A5F' }}>
                            <Phone size={14} style={{ color: '#6B7C8F' }} />
                            {customer.phone}
                          </p>
                          {customer.email && (
                            <p className="text-xs flex items-center gap-1.5" style={{ color: '#6B7C8F' }}>
                              <Mail size={12} />
                              {customer.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm" style={{ color: '#1E3A5F' }}>
                          {customer.product}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <StageBadge stage={customer.followUpStage} reviewStatus={customer.reviewStatus} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/customers/${customer.id}`}>
                          <motion.button
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{ color: '#1E3A5F' }}
                            whileHover={{ backgroundColor: 'rgba(30, 58, 95, 0.08)' }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View
                          </motion.button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y" style={{ borderColor: '#EBE6DF' }}>
              {customers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between mb-3">
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
                        <p className="text-xs" style={{ color: '#6B7C8F' }}>
                          {customer.product}
                        </p>
                      </div>
                    </div>
                    <StageBadge stage={customer.followUpStage} reviewStatus={customer.reviewStatus} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm flex items-center gap-1.5" style={{ color: '#6B7C8F' }}>
                      <Phone size={14} />
                      {customer.phone}
                    </p>
                    <Link href={`/dashboard/customers/${customer.id}`}>
                      <motion.button
                        className="text-sm font-medium flex items-center gap-1"
                        style={{ color: '#D4915E' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View
                        <ChevronRight size={16} />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}