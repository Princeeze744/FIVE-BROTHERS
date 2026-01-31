'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Phone, 
  Mail,
  MapPin,
  Package,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Send,
  Star,
  Trash2,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface Message {
  id: string
  body: string
  direction: 'INBOUND' | 'OUTBOUND'
  sentAt: string
  sentBy?: { name: string }
}

interface FollowUp {
  id: string
  stage: number
  status: string
  dueDate: string
  completedAt: string | null
  feedback: string | null
}

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
  messages: Message[]
  followUps: FollowUp[]
}

function FollowUpTimeline({ followUps, currentStage, reviewStatus }: { 
  followUps: FollowUp[]
  currentStage: number
  reviewStatus: string 
}) {
  const stages = [
    { stage: 1, label: 'First Reach', day: 'Day 1' },
    { stage: 2, label: 'Second Touch', day: 'Day 7' },
    { stage: 3, label: 'Final Ask', day: 'Day 21' },
  ]

  return (
    <div className="flex items-center justify-between relative">
      <div 
        className="absolute top-5 left-0 right-0 h-0.5"
        style={{ backgroundColor: '#EBE6DF' }}
      />
      
      {stages.map((s, index) => {
        const followUp = followUps.find(f => f.stage === s.stage)
        const isCompleted = followUp?.status === 'COMPLETED' || followUp?.status === 'SKIPPED'
        const isCurrent = s.stage === currentStage + 1 && reviewStatus !== 'LEFT_REVIEW'
        
        let bgColor = '#EBE6DF'
        let textColor = '#6B7C8F'
        let borderColor = 'transparent'
        
        if (reviewStatus === 'LEFT_REVIEW') {
          bgColor = '#E8F5ED'
          textColor = '#3D8B5E'
        } else if (isCompleted) {
          bgColor = '#E8F5ED'
          textColor = '#3D8B5E'
        } else if (isCurrent) {
          bgColor = '#FDF4E3'
          textColor = '#E6A23C'
          borderColor = '#E6A23C'
        }
        
        return (
          <div key={s.stage} className="flex flex-col items-center relative z-10">
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: bgColor,
                border: `2px solid ${borderColor}`
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
            >
              {reviewStatus === 'LEFT_REVIEW' || isCompleted ? (
                <CheckCircle2 size={20} style={{ color: textColor }} />
              ) : (
                <span className="text-sm font-semibold" style={{ color: textColor }}>
                  {s.stage}
                </span>
              )}
            </motion.div>
            <p className="text-xs font-medium mt-2" style={{ color: textColor }}>
              {s.label}
            </p>
            <p className="text-xs" style={{ color: '#6B7C8F' }}>
              {s.day}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === 'OUTBOUND'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: isOutbound ? 10 : -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isOutbound ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
        style={{
          backgroundColor: isOutbound ? '#1E3A5F' : '#F5F1EB',
          color: isOutbound ? '#FFFFFF' : '#1E3A5F'
        }}
      >
        <p className="text-sm whitespace-pre-wrap">{message.body}</p>
        <div className={`flex items-center gap-2 mt-1 ${isOutbound ? 'justify-end' : ''}`}>
          <p 
            className={`text-xs ${isOutbound ? 'text-white/60' : ''}`}
            style={{ color: isOutbound ? undefined : '#6B7C8F' }}
          >
            {format(new Date(message.sentAt), 'MMM d, h:mm a')}
          </p>
          {isOutbound && message.sentBy && (
            <span className="text-xs text-white/40">
              • {message.sentBy.name}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Edit Customer Modal
function EditCustomerModal({ 
  isOpen, 
  onClose, 
  customer,
  onSuccess 
}: { 
  isOpen: boolean
  onClose: () => void
  customer: Customer
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    email: customer.email || '',
    address: customer.address,
    city: customer.city,
    product: customer.product,
    specialNote: customer.specialNote || ''
  })

  useEffect(() => {
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address,
      city: customer.city,
      product: customer.product,
      specialNote: customer.specialNote || ''
    })
  }, [customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to update')

      toast.success('Customer updated successfully!')
      onSuccess()
      onClose()
    } catch {
      toast.error('Failed to update customer')
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
          <div 
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: '#EBE6DF' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(30, 58, 95, 0.08)' }}
              >
                <Edit3 size={20} style={{ color: '#1E3A5F' }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: '#1E3A5F' }}>
                  Edit Customer
                </h2>
                <p className="text-sm" style={{ color: '#6B7C8F' }}>
                  Update customer information
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 rounded-xl"
              style={{ color: '#6B7C8F' }}
              whileHover={{ backgroundColor: 'rgba(30, 58, 95, 0.08)' }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-150"
                  style={{
                    backgroundColor: '#F5F1EB',
                    border: '2px solid transparent',
                    color: '#1E3A5F'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-150"
                  style={{
                    backgroundColor: '#F5F1EB',
                    border: '2px solid transparent',
                    color: '#1E3A5F'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-150"
                  style={{
                    backgroundColor: '#F5F1EB',
                    border: '2px solid transparent',
                    color: '#1E3A5F'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-150"
                  style={{
                    backgroundColor: '#F5F1EB',
                    border: '2px solid transparent',
                    color: '#1E3A5F'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-150"
                  style={{
                    backgroundColor: '#F5F1EB',
                    border: '2px solid transparent',
                    color: '#1E3A5F'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
              </div>

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
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Product *
                </label>
                <input
                  type="text"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-150"
                  style={{
                    backgroundColor: '#F5F1EB',
                    border: '2px solid transparent',
                    color: '#1E3A5F'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                  Special Note
                </label>
                <textarea
                  value={formData.specialNote}
                  onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-150 resize-none"
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

            <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: '#EBE6DF' }}>
              <motion.button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{ backgroundColor: '#F5F1EB', color: '#1E3A5F' }}
                whileHover={{ backgroundColor: '#EBE6DF' }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
                whileHover={{ boxShadow: '0 8px 20px rgba(30, 58, 95, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Check size={18} />
                    Save Changes
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

// Delete Confirmation Modal
function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  customer,
  onConfirm 
}: { 
  isOpen: boolean
  onClose: () => void
  customer: Customer
  onConfirm: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete')

      toast.success('Customer deleted successfully')
      onConfirm()
    } catch {
      toast.error('Failed to delete customer')
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
          className="bg-white rounded-2xl w-full max-w-md p-6"
          style={{ boxShadow: '0 24px 48px rgba(30, 58, 95, 0.2)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <AlertTriangle size={32} style={{ color: '#C0392B' }} />
            </motion.div>
            
            <h3 className="text-xl font-semibold" style={{ color: '#1E3A5F' }}>
              Delete Customer
            </h3>
            <p className="text-sm mt-2" style={{ color: '#6B7C8F' }}>
              Are you sure you want to delete <strong>{customer.firstName} {customer.lastName}</strong>? 
              This action cannot be undone.
            </p>

            <div className="mt-6">
              <p className="text-sm mb-2" style={{ color: '#6B7C8F' }}>
                Type <strong>DELETE</strong> to confirm
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl outline-none text-center font-mono tracking-widest"
                style={{
                  backgroundColor: '#F5F1EB',
                  border: confirmText === 'DELETE' ? '2px solid #C0392B' : '2px solid transparent',
                  color: '#1E3A5F'
                }}
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{ backgroundColor: '#F5F1EB', color: '#1E3A5F' }}
                whileHover={{ backgroundColor: '#EBE6DF' }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE' || loading}
                className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#C0392B' }}
                whileHover={confirmText === 'DELETE' ? { backgroundColor: '#A93226' } : {}}
                whileTap={confirmText === 'DELETE' ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchCustomer = useCallback(async () => {
    try {
      const res = await fetch(`/api/customers/${customerId}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCustomer(data.customer)
    } catch {
      toast.error('Failed to load customer')
      router.push('/dashboard/customers')
    } finally {
      setLoading(false)
    }
  }, [customerId, router])

  useEffect(() => {
    fetchCustomer()
  }, [fetchCustomer])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [customer?.messages])

  const handleCompleteFollowUp = async () => {
    if (!customer) return
    
    const pendingFollowUp = customer.followUps.find(f => f.status === 'PENDING')
    if (!pendingFollowUp) return

    setActionLoading(true)
    try {
      const res = await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followUpId: pendingFollowUp.id,
          customerId: customer.id,
          action: 'complete'
        })
      })
      
      if (!res.ok) throw new Error('Failed to complete follow-up')
      
      toast.success('Follow-up completed!')
      fetchCustomer()
    } catch {
      toast.error('Failed to complete follow-up')
    } finally {
      setActionLoading(false)
    }
  }

  const handleMarkReviewed = async (platform: string) => {
    if (!customer) return

    setActionLoading(true)
    try {
      const res = await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          action: 'mark-reviewed',
          platform
        })
      })
      
      if (!res.ok) throw new Error('Failed to mark as reviewed')
      
      toast.success('Customer marked as reviewed!')
      setShowReviewModal(false)
      fetchCustomer()
    } catch {
      toast.error('Failed to mark as reviewed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !customer) return
    
    setSendingMessage(true)
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          body: messageText.trim()
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      toast.success('Message sent!')
      setMessageText('')
      fetchCustomer()
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="bg-white rounded-2xl p-6 h-64" style={{ border: '1px solid #EBE6DF' }} />
      </div>
    )
  }

  if (!customer) return null

  const pendingFollowUp = customer.followUps.find(f => f.status === 'PENDING')

  return (
    <div className="space-y-6 pb-24">
      {/* Edit Modal */}
      {showEditModal && (
        <EditCustomerModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          customer={customer}
          onSuccess={fetchCustomer}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          customer={customer}
          onConfirm={() => router.push('/dashboard/customers')}
        />
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              style={{ boxShadow: '0 24px 48px rgba(30, 58, 95, 0.2)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#FDF4E3' }}
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Star size={32} style={{ color: '#D4915E' }} />
                </motion.div>
                <h3 className="text-xl font-semibold" style={{ color: '#1E3A5F' }}>
                  Mark as Reviewed
                </h3>
                <p className="text-sm mt-1" style={{ color: '#6B7C8F' }}>
                  Where did {customer.firstName} leave their review?
                </p>
              </div>

              <div className="space-y-3">
                {['GOOGLE', 'YELP', 'FACEBOOK', 'OTHER'].map((platform) => (
                  <motion.button
                    key={platform}
                    onClick={() => handleMarkReviewed(platform)}
                    disabled={actionLoading}
                    className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#F5F1EB', color: '#1E3A5F' }}
                    whileHover={{ backgroundColor: '#EBE6DF' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {platform.charAt(0) + platform.slice(1).toLowerCase()}
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={() => setShowReviewModal(false)}
                className="w-full mt-4 py-3 text-sm font-medium"
                style={{ color: '#6B7C8F' }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <Link href="/dashboard/customers">
          <motion.button
            className="p-2 rounded-xl"
            style={{ color: '#6B7C8F' }}
            whileHover={{ backgroundColor: 'rgba(30, 58, 95, 0.08)', color: '#1E3A5F' }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={24} />
          </motion.button>
        </Link>
        
        <div className="flex-1">
          <h1 
            className="text-2xl sm:text-3xl font-semibold"
            style={{ color: '#1E3A5F' }}
          >
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B7C8F' }}>
            Customer since {format(new Date(customer.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <motion.button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium"
            style={{ 
              backgroundColor: '#F5F1EB',
              color: '#1E3A5F'
            }}
            whileHover={{ backgroundColor: '#EBE6DF' }}
            whileTap={{ scale: 0.98 }}
          >
            <Edit3 size={18} />
            <span className="hidden sm:inline">Edit</span>
          </motion.button>

          {/* Delete Button */}
          <motion.button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium"
            style={{ 
              backgroundColor: 'rgba(192, 57, 43, 0.1)',
              color: '#C0392B'
            }}
            whileHover={{ backgroundColor: 'rgba(192, 57, 43, 0.15)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Delete</span>
          </motion.button>

          {/* Review Badge or Button */}
          {customer.reviewStatus === 'LEFT_REVIEW' ? (
            <div 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ backgroundColor: '#E8F5ED' }}
            >
              <CheckCircle2 size={18} style={{ color: '#3D8B5E' }} />
              <span className="font-semibold hidden sm:inline" style={{ color: '#3D8B5E' }}>Reviewed</span>
            </div>
          ) : (
            <motion.button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white"
              style={{ 
                background: 'linear-gradient(135deg, #3D8B5E 0%, #2D7A4E 100%)',
                boxShadow: '0 4px 12px rgba(61, 139, 94, 0.3)'
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(61, 139, 94, 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Star size={18} />
              <span className="hidden sm:inline">Mark Reviewed</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Contact Card */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ 
              boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
              border: '1px solid #EBE6DF'
            }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#6B7C8F' }}>
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(30, 58, 95, 0.08)' }}
                >
                  <Phone size={18} style={{ color: '#1E3A5F' }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#6B7C8F' }}>Phone</p>
                  <p className="font-medium" style={{ color: '#1E3A5F' }}>{customer.phone}</p>
                </div>
              </div>

              {customer.email && (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(30, 58, 95, 0.08)' }}
                  >
                    <Mail size={18} style={{ color: '#1E3A5F' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#6B7C8F' }}>Email</p>
                    <p className="font-medium" style={{ color: '#1E3A5F' }}>{customer.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(30, 58, 95, 0.08)' }}
                >
                  <MapPin size={18} style={{ color: '#1E3A5F' }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#6B7C8F' }}>Address</p>
                  <p className="font-medium" style={{ color: '#1E3A5F' }}>
                    {customer.address}
                  </p>
                  <p style={{ color: '#6B7C8F' }}>{customer.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Info Card */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ 
              boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
              border: '1px solid #EBE6DF'
            }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#6B7C8F' }}>
              Purchase Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212, 145, 94, 0.12)' }}
                >
                  <Package size={18} style={{ color: '#D4915E' }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#6B7C8F' }}>Product</p>
                  <p className="font-medium" style={{ color: '#1E3A5F' }}>{customer.product}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(59, 130, 160, 0.12)' }}
                >
                  <Calendar size={18} style={{ color: '#3B82A0' }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#6B7C8F' }}>Purchase Date</p>
                  <p className="font-medium" style={{ color: '#1E3A5F' }}>
                    {format(new Date(customer.purchaseDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(61, 139, 94, 0.12)' }}
                >
                  <CheckCircle2 size={18} style={{ color: '#3D8B5E' }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#6B7C8F' }}>Delivery Date</p>
                  <p className="font-medium" style={{ color: '#1E3A5F' }}>
                    {format(new Date(customer.deliveryDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {customer.specialNote && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: '#EBE6DF' }}>
                <p className="text-xs mb-2" style={{ color: '#6B7C8F' }}>Special Note</p>
                <p className="text-sm p-3 rounded-xl" style={{ backgroundColor: '#F5F1EB', color: '#1E3A5F' }}>
                  {customer.specialNote}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column - Follow-ups and Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Follow-up Progress Card */}
          <div 
            className="bg-white rounded-2xl p-6"
            style={{ 
              boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
              border: '1px solid #EBE6DF'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: '#1E3A5F' }}>
                Follow-up Progress
              </h3>
              {customer.reviewStatus === 'LEFT_REVIEW' && (
                <span 
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: '#E8F5ED', color: '#3D8B5E' }}
                >
                  Complete - Review Received!
                </span>
              )}
            </div>

            <FollowUpTimeline 
              followUps={customer.followUps}
              currentStage={customer.followUpStage}
              reviewStatus={customer.reviewStatus}
            />

            {customer.reviewStatus !== 'LEFT_REVIEW' && pendingFollowUp && (
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#EBE6DF' }}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={handleCompleteFollowUp}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
                    whileHover={{ boxShadow: '0 8px 20px rgba(30, 58, 95, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {actionLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={18} />
                        Complete Stage {customer.followUpStage + 1}
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setShowReviewModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold"
                    style={{ backgroundColor: '#FDF4E3', color: '#D4915E' }}
                    whileHover={{ backgroundColor: '#FCE9D0' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Star size={18} />
                    Mark as Reviewed
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* Messages Card */}
          <div 
            className="bg-white rounded-2xl overflow-hidden"
            style={{ 
              boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
              border: '1px solid #EBE6DF'
            }}
          >
            <div className="p-6 border-b" style={{ borderColor: '#EBE6DF' }}>
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#1E3A5F' }}>
                <MessageSquare size={20} />
                Messages
                {customer.messages.length > 0 && (
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#F5F1EB', color: '#6B7C8F' }}
                  >
                    {customer.messages.length}
                  </span>
                )}
              </h3>
            </div>

            <div 
              className="p-6 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4" 
              style={{ backgroundColor: '#FDFBF8' }}
            >
              {customer.messages.length === 0 ? (
                <div className="text-center py-8">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: '#F5F1EB' }}
                  >
                    <MessageSquare size={28} style={{ color: '#6B7C8F' }} />
                  </div>
                  <p className="font-medium" style={{ color: '#1E3A5F' }}>No messages yet</p>
                  <p className="text-sm mt-1" style={{ color: '#6B7C8F' }}>
                    Send the first message to this customer
                  </p>
                </div>
              ) : (
                <>
                  {customer.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="p-4 border-t" style={{ borderColor: '#EBE6DF' }}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl outline-none"
                  style={{
                    backgroundColor: '#F5F1EB',
                    border: '2px solid transparent',
                    color: '#1E3A5F'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
                  disabled={sendingMessage}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendingMessage}
                  className="px-4 py-3 rounded-xl text-white disabled:opacity-50 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)' }}
                  whileHover={{ scale: sendingMessage ? 1 : 1.05 }}
                  whileTap={{ scale: sendingMessage ? 1 : 0.95 }}
                >
                  {sendingMessage ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </motion.button>
              </div>
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#3D8B5E' }}>
                <CheckCircle2 size={12} />
                SMS powered by Twilio
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}