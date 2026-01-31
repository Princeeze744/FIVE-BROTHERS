'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check,
  Search,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  MessageSquare,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Template {
  id: string
  name: string
  body: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Variables that can be used in templates
const TEMPLATE_VARIABLES = [
  { var: '{{firstName}}', desc: 'Customer first name' },
  { var: '{{lastName}}', desc: 'Customer last name' },
  { var: '{{product}}', desc: 'Product purchased' },
  { var: '{{company}}', desc: 'Five Brothers Appliances' },
]

// Template Modal Component
function TemplateModal({ 
  isOpen, 
  onClose, 
  template,
  onSuccess 
}: { 
  isOpen: boolean
  onClose: () => void
  template?: Template | null
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    body: ''
  })

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        body: template.body
      })
    } else {
      setFormData({ name: '', body: '' })
    }
  }, [template, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = template 
        ? `/api/templates/${template.id}` 
        : '/api/templates'
      
      const res = await fetch(url, {
        method: template ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to save template')

      toast.success(template ? 'Template updated!' : 'Template created!')
      onSuccess()
      onClose()
    } catch {
      toast.error('Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  const insertVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      body: prev.body + variable
    }))
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
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
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
              style={{ backgroundColor: 'rgba(212, 145, 94, 0.12)' }}
            >
              <FileText size={20} style={{ color: '#D4915E' }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: '#1E3A5F' }}>
                {template ? 'Edit Template' : 'New Template'}
              </h2>
              <p className="text-sm" style={{ color: '#6B7C8F' }}>
                {template ? 'Update your message template' : 'Create a reusable message template'}
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Template Name */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
              Template Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-150"
              style={{
                backgroundColor: '#F5F1EB',
                border: '2px solid transparent',
                color: '#1E3A5F'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
              placeholder="e.g., First Follow-up, Review Request, Thank You"
            />
          </div>

          {/* Variables Helper */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
              Quick Insert Variables
            </label>
            <div className="flex flex-wrap gap-2">
              {TEMPLATE_VARIABLES.map((v) => (
                <motion.button
                  key={v.var}
                  type="button"
                  onClick={() => insertVariable(v.var)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: 'rgba(30, 58, 95, 0.08)', color: '#1E3A5F' }}
                  whileHover={{ backgroundColor: 'rgba(30, 58, 95, 0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  title={v.desc}
                >
                  {v.var}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Message Body */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
              Message Body *
            </label>
            <textarea
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-150 resize-none"
              style={{
                backgroundColor: '#F5F1EB',
                border: '2px solid transparent',
                color: '#1E3A5F'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
              placeholder="Hi {{firstName}}, thank you for purchasing your {{product}} from Five Brothers Appliances!"
            />
            <p className="text-xs mt-2" style={{ color: '#6B7C8F' }}>
              {formData.body.length} characters
            </p>
          </div>

          {/* Preview */}
          {formData.body && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#1E3A5F' }}>
                Preview
              </label>
              <div 
                className="p-4 rounded-xl text-sm"
                style={{ backgroundColor: '#FDFBF8', border: '1px solid #EBE6DF', color: '#1E3A5F' }}
              >
                {formData.body
                  .replace('{{firstName}}', 'John')
                  .replace('{{lastName}}', 'Smith')
                  .replace('{{product}}', 'Samsung Refrigerator')
                  .replace('{{company}}', 'Five Brothers Appliances')
                }
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#EBE6DF' }}>
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
                  {template ? 'Update Template' : 'Create Template'}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Delete Confirmation Modal
function DeleteModal({ 
  isOpen, 
  onClose, 
  template,
  onConfirm 
}: { 
  isOpen: boolean
  onClose: () => void
  template: Template | null
  onConfirm: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!template) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/templates/${template.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete')

      toast.success('Template deleted!')
      onConfirm()
      onClose()
    } catch {
      toast.error('Failed to delete template')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !template) return null

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
            style={{ backgroundColor: 'rgba(192, 57, 43, 0.1)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
          >
            <AlertTriangle size={32} style={{ color: '#C0392B' }} />
          </motion.div>
          
          <h3 className="text-xl font-semibold" style={{ color: '#1E3A5F' }}>
            Delete Template
          </h3>
          <p className="text-sm mt-2" style={{ color: '#6B7C8F' }}>
            Are you sure you want to delete <strong>{template.name}</strong>? 
            This action cannot be undone.
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
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: '#C0392B' }}
              whileHover={{ backgroundColor: '#A93226' }}
              whileTap={{ scale: 0.98 }}
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
  )
}

// Template Card Component
function TemplateCard({ 
  template, 
  onEdit, 
  onDelete,
  index 
}: { 
  template: Template
  onEdit: () => void
  onDelete: () => void
  index: number
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template.body)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl p-5 sm:p-6 group"
      style={{ 
        boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
        border: '1px solid #EBE6DF'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(212, 145, 94, 0.12)' }}
          >
            <MessageSquare size={18} style={{ color: '#D4915E' }} />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: '#1E3A5F' }}>
              {template.name}
            </h3>
            <p className="text-xs" style={{ color: '#6B7C8F' }}>
              {template.body.length} characters
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            onClick={handleCopy}
            className="p-2 rounded-lg"
            style={{ color: copied ? '#3D8B5E' : '#6B7C8F' }}
            whileHover={{ backgroundColor: 'rgba(30, 58, 95, 0.08)' }}
            whileTap={{ scale: 0.95 }}
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          </motion.button>
          <motion.button
            onClick={onEdit}
            className="p-2 rounded-lg"
            style={{ color: '#6B7C8F' }}
            whileHover={{ backgroundColor: 'rgba(30, 58, 95, 0.08)', color: '#1E3A5F' }}
            whileTap={{ scale: 0.95 }}
            title="Edit template"
          >
            <Edit3 size={18} />
          </motion.button>
          <motion.button
            onClick={onDelete}
            className="p-2 rounded-lg"
            style={{ color: '#6B7C8F' }}
            whileHover={{ backgroundColor: 'rgba(192, 57, 43, 0.1)', color: '#C0392B' }}
            whileTap={{ scale: 0.95 }}
            title="Delete template"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>

      {/* Message Preview */}
      <div 
        className="p-4 rounded-xl text-sm leading-relaxed"
        style={{ backgroundColor: '#FDFBF8', color: '#1E3A5F' }}
      >
        <p className="line-clamp-3">{template.body}</p>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: '#EBE6DF' }}>
        <span 
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: template.isActive ? 'rgba(61, 139, 94, 0.1)' : 'rgba(107, 124, 143, 0.1)',
            color: template.isActive ? '#3D8B5E' : '#6B7C8F'
          }}
        >
          <span 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: template.isActive ? '#3D8B5E' : '#6B7C8F' }}
          />
          {template.isActive ? 'Active' : 'Inactive'}
        </span>
        
        <span className="text-xs" style={{ color: '#6B7C8F' }}>
          Updated {new Date(template.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  )
}

// Main Templates Page
export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setTemplates(data.templates)
    } catch {
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template)
    setShowModal(true)
  }

  const handleDelete = (template: Template) => {
    setSelectedTemplate(template)
    setShowDeleteModal(true)
  }

  const handleNewTemplate = () => {
    setSelectedTemplate(null)
    setShowModal(true)
  }

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.body.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <TemplateModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            template={selectedTemplate}
            onSuccess={fetchTemplates}
          />
        )}
        {showDeleteModal && (
          <DeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            template={selectedTemplate}
            onConfirm={fetchTemplates}
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
              Message Templates
            </h1>
            <Sparkles size={24} style={{ color: '#D4915E' }} />
          </div>
          <p className="mt-1.5 text-sm sm:text-base" style={{ color: '#6B7C8F' }}>
            Create and manage reusable follow-up messages
          </p>
        </div>

        <motion.button
          onClick={handleNewTemplate}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white"
          style={{ 
            background: 'linear-gradient(135deg, #D4915E 0%, #C4814E 100%)',
            boxShadow: '0 4px 12px rgba(212, 145, 94, 0.3)'
          }}
          whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(212, 145, 94, 0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          <span>New Template</span>
        </motion.button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
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
          placeholder="Search templates..."
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

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="bg-white rounded-2xl p-6 animate-pulse"
              style={{ border: '1px solid #EBE6DF' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-100 rounded mt-2" />
                </div>
              </div>
              <div className="h-20 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#F5F1EB' }}
          >
            <FileText size={36} style={{ color: '#6B7C8F' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: '#1E3A5F' }}>
            {searchQuery ? 'No templates found' : 'No templates yet'}
          </h3>
          <p className="text-sm mt-2 max-w-sm mx-auto" style={{ color: '#6B7C8F' }}>
            {searchQuery 
              ? `No templates match your search for: ${searchQuery}`
              : 'Create your first template to speed up customer follow-ups'
            }
          </p>
          {!searchQuery && (
            <motion.button
              onClick={handleNewTemplate}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: '#1E3A5F' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} />
              Create First Template
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
              onEdit={() => handleEdit(template)}
              onDelete={() => handleDelete(template)}
            />
          ))}
        </div>
      )}

      {/* Quick Tips */}
      {!loading && templates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 sm:p-6"
          style={{ 
            boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
            border: '1px solid #EBE6DF'
          }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#6B7C8F' }}>
            Template Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Personalize', desc: 'Use {{firstName}} to make messages personal' },
              { title: 'Keep it Short', desc: 'SMS works best under 160 characters' },
              { title: 'Clear CTA', desc: 'Tell customers exactly what action to take' },
              { title: 'Be Friendly', desc: 'Warm, casual tone works best for follow-ups' },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ backgroundColor: 'rgba(212, 145, 94, 0.12)', color: '#D4915E' }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#1E3A5F' }}>{tip.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7C8F' }}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}