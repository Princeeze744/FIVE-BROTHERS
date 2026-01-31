'use client'

import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Send, 
  Smartphone,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react'

export default function MessagesPage() {
  const features = [
    { icon: Send, text: 'Send SMS directly from the app' },
    { icon: Smartphone, text: 'Receive customer replies' },
    { icon: MessageSquare, text: 'View all conversations in one place' },
    { icon: CheckCircle2, text: 'Track message delivery status' },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Header */}
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
            Messages
          </h1>
          <MessageSquare size={24} style={{ color: '#D4915E' }} />
        </div>
        <p className="mt-1.5 text-sm sm:text-base" style={{ color: '#6B7C8F' }}>
          Two-way SMS communication with customers
        </p>
      </motion.div>

      {/* Coming Soon Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl p-8 sm:p-12 text-center"
        style={{ 
          boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
          border: '1px solid #EBE6DF'
        }}
      >
        {/* Icon */}
        <motion.div
          className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center relative"
          style={{ backgroundColor: 'rgba(212, 145, 94, 0.1)' }}
          animate={{ 
            boxShadow: [
              '0 0 0 0 rgba(212, 145, 94, 0.2)',
              '0 0 0 20px rgba(212, 145, 94, 0)',
              '0 0 0 0 rgba(212, 145, 94, 0)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <MessageSquare size={40} style={{ color: '#D4915E' }} />
          <motion.div
            className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#FDF4E3' }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap size={16} style={{ color: '#D4915E' }} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <h2 
          className="text-2xl sm:text-3xl font-semibold mb-3"
          style={{ color: '#1E3A5F' }}
        >
          SMS Integration Coming Soon
        </h2>
        
        <p 
          className="text-base max-w-md mx-auto mb-8"
          style={{ color: '#6B7C8F' }}
        >
          We are setting up Twilio integration to enable two-way SMS messaging with your customers.
        </p>

        {/* Features List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ backgroundColor: '#FDFBF8' }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(61, 139, 94, 0.1)' }}
              >
                <feature.icon size={16} style={{ color: '#3D8B5E' }} />
              </div>
              <span className="text-sm text-left" style={{ color: '#1E3A5F' }}>
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ backgroundColor: 'rgba(230, 162, 60, 0.1)' }}
        >
          <Clock size={16} style={{ color: '#E6A23C' }} />
          <span className="text-sm font-medium" style={{ color: '#E6A23C' }}>
            Pending Twilio Setup
          </span>
        </motion.div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl p-6"
        style={{ 
          boxShadow: '0 2px 12px rgba(30, 58, 95, 0.06)',
          border: '1px solid #EBE6DF'
        }}
      >
        <h3 
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: '#6B7C8F' }}
        >
          We are setting up Twilio integration to enable two-way SMS messa💡 What You Will Be Able To Doging with your customers.
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#FDFBF8' }}>
            <h4 className="font-semibold mb-2" style={{ color: '#1E3A5F' }}>
              Send Follow-ups
            </h4>
            <p className="text-sm" style={{ color: '#6B7C8F' }}>
              Send personalized SMS messages using your templates directly from customer profiles.
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#FDFBF8' }}>
            <h4 className="font-semibold mb-2" style={{ color: '#1E3A5F' }}>
              Receive Replies
            </h4>
            <p className="text-sm" style={{ color: '#6B7C8F' }}>
              Customer responses appear here automatically, keeping all communication in one place.
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#FDFBF8' }}>
            <h4 className="font-semibold mb-2" style={{ color: '#1E3A5F' }}>
              Global Inbox
            </h4>
            <p className="text-sm" style={{ color: '#6B7C8F' }}>
              View all conversations across customers in this unified inbox.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}