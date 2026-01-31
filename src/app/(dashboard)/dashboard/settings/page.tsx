'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings,
  Users,
  Plus, 
  Edit3, 
  X, 
  Check,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  Crown
} from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface UserData {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'STAFF'
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    customers: number
    messages: number
  }
}

// User Modal Component (Create/Edit)
function UserModal({ 
  isOpen, 
  onClose, 
  user,
  onSuccess 
}: { 
  isOpen: boolean
  onClose: () => void
  user?: UserData | null
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF' as 'ADMIN' | 'STAFF'
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      })
    } else {
      setFormData({ name: '', email: '', password: '', role: 'STAFF' })
    }
  }, [user, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!user && !formData.password) {
      toast.error('Password is required for new users')
      return
    }

    setLoading(true)

    try {
      const url = user ? `/api/users/${user.id}` : '/api/users'
      const body = user 
        ? { 
            name: formData.name, 
            email: formData.email, 
            role: formData.role,
            ...(formData.password && { password: formData.password })
          }
        : formData

      const res = await fetch(url, {
        method: user ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to save user')

      toast.success(user ? 'User updated!' : 'User created!')
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
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
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: '0 24px 48px rgba(30, 58, 95, 0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: '#EBE6DF' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(30, 58, 95, 0.08)' }}
            >
              {user ? <Edit3 size={20} style={{ color: '#1E3A5F' }} /> : <Plus size={20} style={{ color: '#1E3A5F' }} />}
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: '#1E3A5F' }}>
                {user ? 'Edit User' : 'Add New User'}
              </h2>
              <p className="text-sm" style={{ color: '#6B7C8F' }}>
                {user ? 'Update user information' : 'Create a new team member'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
              Full Name *
            </label>
            <div className="relative">
              <div 
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#6B7C8F' }}
              >
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
                style={{
                  backgroundColor: '#F5F1EB',
                  border: '2px solid transparent',
                  color: '#1E3A5F'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                onBlur={(e) => e.target.style.borderColor = 'transparent'}
                placeholder="John Smith"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
              Email Address *
            </label>
            <div className="relative">
              <div 
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#6B7C8F' }}
              >
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all duration-150"
                style={{
                  backgroundColor: '#F5F1EB',
                  border: '2px solid transparent',
                  color: '#1E3A5F'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                onBlur={(e) => e.target.style.borderColor = 'transparent'}
                placeholder="john@fivebrothers.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
              Password {user ? '(leave blank to keep current)' : '*'}
            </label>
            <div className="relative">
              <div 
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#6B7C8F' }}
              >
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required={!user}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-12 py-3 rounded-xl outline-none transition-all duration-150"
                style={{
                  backgroundColor: '#F5F1EB',
                  border: '2px solid transparent',
                  color: '#1E3A5F'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
                onBlur={(e) => e.target.style.borderColor = 'transparent'}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors duration-150"
                style={{ color: '#6B7C8F' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
              Role *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'STAFF' })}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all`}
                style={{
                  borderColor: formData.role === 'STAFF' ? '#1E3A5F' : '#EBE6DF',
                  backgroundColor: formData.role === 'STAFF' ? 'rgba(30, 58, 95, 0.05)' : 'transparent'
                }}
                whileHover={{ borderColor: '#1E3A5F' }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield size={24} style={{ color: formData.role === 'STAFF' ? '#1E3A5F' : '#6B7C8F' }} />
                <span 
                  className="text-sm font-medium"
                  style={{ color: formData.role === 'STAFF' ? '#1E3A5F' : '#6B7C8F' }}
                >
                  Staff
                </span>
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all`}
                style={{
                  borderColor: formData.role === 'ADMIN' ? '#D4915E' : '#EBE6DF',
                  backgroundColor: formData.role === 'ADMIN' ? 'rgba(212, 145, 94, 0.05)' : 'transparent'
                }}
                whileHover={{ borderColor: '#D4915E' }}
                whileTap={{ scale: 0.98 }}
              >
                <Crown size={24} style={{ color: formData.role === 'ADMIN' ? '#D4915E' : '#6B7C8F' }} />
                <span 
                  className="text-sm font-medium"
                  style={{ color: formData.role === 'ADMIN' ? '#D4915E' : '#6B7C8F' }}
                >
                  Admin
                </span>
              </motion.button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
                  {user ? 'Update User' : 'Create User'}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Deactivate Confirmation Modal
function DeactivateModal({ 
  isOpen, 
  onClose, 
  user,
  onConfirm 
}: { 
  isOpen: boolean
  onClose: () => void
  user: UserData | null
  onConfirm: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleDeactivate = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive })
      })

      if (!res.ok) throw new Error('Failed to update user status')

      toast.success(user.isActive ? 'User deactivated!' : 'User activated!')
      onConfirm()
      onClose()
    } catch {
        toast.error('Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !user) return null

  return (
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
            style={{ backgroundColor: user.isActive ? 'rgba(192, 57, 43, 0.1)' : 'rgba(61, 139, 94, 0.1)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
          >
            {user.isActive ? (
              <UserX size={32} style={{ color: '#C0392B' }} />
            ) : (
              <UserCheck size={32} style={{ color: '#3D8B5E' }} />
            )}
          </motion.div>
          
          <h3 className="text-xl font-semibold" style={{ color: '#1E3A5F' }}>
            {user.isActive ? 'Deactivate User' : 'Activate User'}
          </h3>
          <p className="text-sm mt-2" style={{ color: '#6B7C8F' }}>
            {user.isActive 
              ? `Are you sure you want to deactivate "${user.name}"? They will no longer be able to log in.`
              : `Are you sure you want to reactivate "${user.name}"? They will be able to log in again.`
            }
          </p>

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
              onClick={handleDeactivate}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: user.isActive ? '#C0392B' : '#3D8B5E' }}
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// User Card Component
function UserCard({ 
  user, 
  currentUserId,
  onEdit, 
  onToggleStatus,
  index 
}: { 
  user: UserData
  currentUserId: string
  onEdit: () => void
  onToggleStatus: () => void
  index: number
}) {
  const isCurrentUser = user.id === currentUserId

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`bg-white rounded-2xl p-5 sm:p-6 group ${!user.isActive ? 'opacity-60' : ''}`}
      style={{ 
        boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
        border: '1px solid #EBE6DF'
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
          style={{ 
            background: user.role === 'ADMIN' 
              ? 'linear-gradient(135deg, #D4915E 0%, #C4814E 100%)'
              : 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)'
          }}
        >
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold" style={{ color: '#1E3A5F' }}>
              {user.name}
            </h3>
            {isCurrentUser && (
              <span 
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: 'rgba(30, 58, 95, 0.1)', color: '#1E3A5F' }}
              >
                You
              </span>
            )}
            <span 
              className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1`}
              style={{ 
                backgroundColor: user.role === 'ADMIN' ? 'rgba(212, 145, 94, 0.12)' : 'rgba(30, 58, 95, 0.08)',
                color: user.role === 'ADMIN' ? '#D4915E' : '#1E3A5F'
              }}
            >
              {user.role === 'ADMIN' ? <Crown size={12} /> : <Shield size={12} />}
              {user.role}
            </span>
          </div>
          
          <p className="text-sm mt-1 truncate" style={{ color: '#6B7C8F' }}>
            {user.email}
          </p>

          <div className="flex items-center gap-4 mt-3">
            <span 
              className={`inline-flex items-center gap-1.5 text-xs font-medium`}
              style={{ color: user.isActive ? '#3D8B5E' : '#C0392B' }}
            >
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: user.isActive ? '#3D8B5E' : '#C0392B' }}
              />
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className="text-xs" style={{ color: '#6B7C8F' }}>
              Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Actions */}
        {!isCurrentUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              onClick={onEdit}
              className="p-2 rounded-lg"
              style={{ color: '#6B7C8F' }}
              whileHover={{ backgroundColor: 'rgba(30, 58, 95, 0.08)', color: '#1E3A5F' }}
              whileTap={{ scale: 0.95 }}
              title="Edit user"
            >
              <Edit3 size={18} />
            </motion.button>
            <motion.button
              onClick={onToggleStatus}
              className="p-2 rounded-lg"
              style={{ color: '#6B7C8F' }}
              whileHover={{ 
                backgroundColor: user.isActive ? 'rgba(192, 57, 43, 0.1)' : 'rgba(61, 139, 94, 0.1)', 
                color: user.isActive ? '#C0392B' : '#3D8B5E'
              }}
              whileTap={{ scale: 0.95 }}
              title={user.isActive ? 'Deactivate user' : 'Activate user'}
            >
              {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Main Settings Page
export default function SettingsPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)

  // Check if current user is admin
  const isAdmin = (session?.user as any)?.role === 'ADMIN'
  const currentUserId = (session?.user as any)?.id

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setUsers(data.users)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: UserData) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleToggleStatus = (user: UserData) => {
    setSelectedUser(user)
    setShowStatusModal(true)
  }

  const handleNewUser = () => {
    setSelectedUser(null)
    setShowModal(true)
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Non-admin view
  if (!isAdmin) {
    return (
      <div className="space-y-6 sm:space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <h1 
              className="text-2xl sm:text-3xl font-semibold"
              style={{ 
                color: '#1E3A5F',
                fontFamily: 'var(--font-display), system-ui, sans-serif'
              }}
            >
              Settings
            </h1>
            <Settings size={24} style={{ color: '#D4915E' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(230, 162, 60, 0.1)' }}
          >
            <ShieldCheck size={36} style={{ color: '#E6A23C' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: '#1E3A5F' }}>
            Admin Access Required
          </h3>
          <p className="text-sm mt-2 max-w-sm mx-auto" style={{ color: '#6B7C8F' }}>
            Only administrators can access user management settings. Contact your admin if you need changes to your account.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <UserModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            user={selectedUser}
            onSuccess={fetchUsers}
          />
        )}
        {showStatusModal && (
          <DeactivateModal
            isOpen={showStatusModal}
            onClose={() => setShowStatusModal(false)}
            user={selectedUser}
            onConfirm={fetchUsers}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 
              className="text-2xl sm:text-3xl font-semibold"
              style={{ 
                color: '#1E3A5F',
                fontFamily: 'var(--font-display), system-ui, sans-serif'
              }}
            >
              Settings
            </h1>
            <Settings size={24} style={{ color: '#D4915E' }} />
          </div>
          <p className="mt-1.5 text-sm sm:text-base" style={{ color: '#6B7C8F' }}>
            Manage your team members and permissions
          </p>
        </div>

        <motion.button
          onClick={handleNewUser}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white"
          style={{ 
            background: 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)',
            boxShadow: '0 4px 12px rgba(30, 58, 95, 0.3)'
          }}
          whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(30, 58, 95, 0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          <span>Add User</span>
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div 
          className="bg-white rounded-xl p-4"
          style={{ border: '1px solid #EBE6DF' }}
        >
          <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
            {users.length}
          </p>
          <p className="text-xs mt-1" style={{ color: '#6B7C8F' }}>Total Users</p>
        </div>
        <div 
          className="bg-white rounded-xl p-4"
          style={{ border: '1px solid #EBE6DF' }}
        >
          <p className="text-2xl font-bold" style={{ color: '#3D8B5E' }}>
            {users.filter(u => u.isActive).length}
          </p>
          <p className="text-xs mt-1" style={{ color: '#6B7C8F' }}>Active</p>
        </div>
        <div 
          className="bg-white rounded-xl p-4"
          style={{ border: '1px solid #EBE6DF' }}
        >
          <p className="text-2xl font-bold" style={{ color: '#D4915E' }}>
            {users.filter(u => u.role === 'ADMIN').length}
          </p>
          <p className="text-xs mt-1" style={{ color: '#6B7C8F' }}>Admins</p>
        </div>
        <div 
          className="bg-white rounded-xl p-4"
          style={{ border: '1px solid #EBE6DF' }}
        >
          <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
            {users.filter(u => u.role === 'STAFF').length}
          </p>
          <p className="text-xs mt-1" style={{ color: '#6B7C8F' }}>Staff</p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative"
      >
        <div 
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#6B7C8F' }}
        >
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all duration-150"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #EBE6DF',
            color: '#1E3A5F'
          }}
          onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
          onBlur={(e) => e.target.style.borderColor = '#EBE6DF'}
        />
      </motion.div>

      {/* Users List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="bg-white rounded-2xl p-6 animate-pulse"
              style={{ border: '1px solid #EBE6DF' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-48 bg-gray-100 rounded mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#F5F1EB' }}
          >
            <Users size={36} style={{ color: '#6B7C8F' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: '#1E3A5F' }}>
            {searchQuery ? 'No users found' : 'No team members yet'}
          </h3>
          <p className="text-sm mt-2 max-w-sm mx-auto" style={{ color: '#6B7C8F' }}>
            {searchQuery 
              ? `No users match "${searchQuery}"`
              : 'Add your first team member to get started'
            }
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <UserCard
              key={user.id}
              user={user}
              currentUserId={currentUserId}
              index={index}
              onEdit={() => handleEdit(user)}
              onToggleStatus={() => handleToggleStatus(user)}
            />
          ))}
        </div>
      )}
    </div>
  )
}