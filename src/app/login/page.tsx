'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (result?.error) {
      setError(true)
      toast.error('Invalid email or password')
      setLoading(false)
      setTimeout(() => setError(false), 500)
    } else {
      setSuccess(true)
      toast.success('Welcome back!')
      setTimeout(() => {
        router.push('/dashboard')
      }, 800)
    }
  }

  return (
    <div 
      className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden relative"
      style={{ backgroundColor: '#FDFBF8' }}
    >
      {/* Animated background gradients */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div 
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 sm:w-2/3 sm:h-2/3"
          style={{
            background: 'radial-gradient(ellipse, rgba(212, 145, 94, 0.08), transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        <div 
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 sm:w-2/3 sm:h-2/3"
          style={{
            background: 'radial-gradient(ellipse, rgba(30, 58, 95, 0.05), transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
      </motion.div>
      
      <div className="relative w-full max-w-[420px]">
        {/* Logo Section - Above card */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/logo.png"
              alt="Five Brothers Appliance"
              width={220}
              height={140}
              className="w-[180px] sm:w-[200px] h-auto object-contain"
              style={{
                filter: 'drop-shadow(0 4px 12px rgba(30, 58, 95, 0.1))'
              }}
              priority
            />
          </motion.div>
        </motion.div>

        {/* Login Card */}
        <motion.div 
          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: error ? [0, -10, 10, -10, 10, 0] : 0
          }}
          transition={{ 
            duration: 0.6, 
            delay: 0.1,
            ease: [0.23, 1, 0.32, 1],
            x: { duration: 0.4 }
          }}
          style={{ 
            boxShadow: '0 4px 40px rgba(30, 58, 95, 0.1), 0 0 0 1px rgba(235, 230, 223, 0.6)',
          }}
        >
          {/* Decorative top accent */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl sm:rounded-t-3xl"
            style={{ 
              background: 'linear-gradient(90deg, #1E3A5F 0%, #D4915E 50%, #3D8B5E 100%)'
            }}
          />

          {/* CRM Badge */}
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ 
                backgroundColor: 'rgba(30, 58, 95, 0.04)',
                border: '1px solid rgba(30, 58, 95, 0.08)'
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#3D8B5E' }}
              />
              <span 
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#1E3A5F' }}
              >
                CRM System
              </span>
            </div>
          </motion.div>

          {/* Welcome text */}
          <div className="text-center mb-6">
            <h2 
              className="text-xl sm:text-2xl font-semibold"
              style={{ 
                color: '#1E3A5F',
                fontFamily: 'var(--font-display), system-ui, sans-serif'
              }}
            >
              Welcome back
            </h2>
            <p 
              className="text-sm mt-1.5"
              style={{ color: '#6B7C8F' }}
            >
              Sign in to manage your customer follow-ups
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#1E3A5F' }}
              >
                Email
              </label>
              <motion.div
                className="relative"
                animate={{
                  boxShadow: emailFocused 
                    ? '0 0 0 4px rgba(30, 58, 95, 0.1)' 
                    : '0 0 0 0px rgba(30, 58, 95, 0)'
                }}
                transition={{ duration: 0.15 }}
                style={{ borderRadius: '12px' }}
              >
                <div 
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
                  style={{ color: emailFocused ? '#1E3A5F' : '#6B7C8F' }}
                >
                  <Mail size={18} strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all duration-150"
                  style={{
                    backgroundColor: '#F5F1EB',
                    border: emailFocused ? '2px solid #1E3A5F' : '2px solid transparent',
                    color: '#1E3A5F',
                    fontSize: '15px'
                  }}
                  placeholder="you@fivebrothers.com"
                  autoComplete="email"
                  required
                />
              </motion.div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: '#1E3A5F' }}
              >
                Password
              </label>
              <motion.div
                className="relative"
                animate={{
                  boxShadow: passwordFocused 
                    ? '0 0 0 4px rgba(30, 58, 95, 0.1)' 
                    : '0 0 0 0px rgba(30, 58, 95, 0)'
                }}
                transition={{ duration: 0.15 }}
                style={{ borderRadius: '12px' }}
              >
                <div 
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
                  style={{ color: passwordFocused ? '#1E3A5F' : '#6B7C8F' }}
                >
                  <Lock size={18} strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl outline-none transition-all duration-150"
                  style={{
                    backgroundColor: '#F5F1EB',
                    border: passwordFocused ? '2px solid #1E3A5F' : '2px solid transparent',
                    color: '#1E3A5F',
                    fontSize: '15px'
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors duration-150 hover:bg-white/50"
                  style={{ color: '#6B7C8F' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="pt-2"
            >
              <motion.button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 text-white font-semibold rounded-xl 
                         disabled:cursor-not-allowed 
                         flex items-center justify-center gap-2 relative overflow-hidden"
                style={{ 
                  background: success 
                    ? 'linear-gradient(135deg, #3D8B5E 0%, #2D7A4E 100%)' 
                    : 'linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%)',
                  fontSize: '15px',
                  boxShadow: success 
                    ? '0 4px 16px rgba(61, 139, 94, 0.3)'
                    : '0 4px 16px rgba(30, 58, 95, 0.25)'
                }}
                whileHover={!loading && !success ? { 
                  y: -2,
                  boxShadow: '0 8px 24px rgba(30, 58, 95, 0.35)'
                } : {}}
                whileTap={!loading && !success ? { 
                  y: 0,
                  scale: 0.98
                } : {}}
                transition={{ duration: 0.15 }}
              >
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                      >
                        <Check size={20} strokeWidth={3} />
                      </motion.div>
                      <span>Welcome!</span>
                    </motion.div>
                  ) : loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <circle 
                            className="opacity-25" 
                            cx="12" cy="12" r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                            fill="none"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </motion.div>
                      <span>Signing in...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span>Sign In</span>
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p 
            className="text-center text-xs mt-6 pt-5 border-t"
            style={{ color: '#6B7C8F', borderColor: '#EBE6DF' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Need help? Contact your administrator
          </motion.p>
        </motion.div>

        {/* Mobile home indicator */}
        <motion.div
          className="sm:hidden flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div 
            className="w-32 h-1 rounded-full"
            style={{ backgroundColor: '#EBE6DF' }}
          />
        </motion.div>
      </div>
    </div>
  )
}