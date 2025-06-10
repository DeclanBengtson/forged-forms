'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { analytics } from '@/components/analytics/GoogleAnalytics'

function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const supabase = createClient()

  // Get redirect URL from search params
  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms of use and privacy policy')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
        },
      })

      if (error) throw error

      if (data.user) {
        // Track successful signup
        analytics.signup('email')
        
        if (data.user.email_confirmed_at) {
          // User is immediately confirmed (email verification disabled)
          setMessage('Account created successfully! Redirecting...')
          setTimeout(() => {
            router.push(redirectUrl)
            router.refresh()
          }, 1000)
        } else {
          // Email verification required (production behavior)
          setEmailSent(true)
          setMessage(`We've sent a confirmation email to ${email}. Please check your inbox and click the confirmation link to complete your account setup.`)
        }
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
        }
      })

      if (error) throw error
      
      setMessage(`Confirmation email resent to ${email}. Please check your inbox.`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to resend email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ForgedForms
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              {emailSent ? 'Check your email' : 'Create your account'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {emailSent 
                ? 'We sent you a confirmation link' 
                : redirectUrl === '/pricing' 
                  ? 'Create an account to choose your plan'
                  : 'Join ForgedForms to create powerful forms'
              }
            </p>
          </div>

          {!emailSent ? (
            <>
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Create a password (min. 6 characters)"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      required
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                      I understand and agree to the{' '}
                      <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                        terms of use
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                        privacy policy
                      </Link>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {message && !emailSent && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-300 text-sm">{message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link 
                    href={`/login${redirectUrl !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`} 
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {message && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="ml-3 text-blue-800 dark:text-blue-300 text-sm">{message}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Resend confirmation email'}
                </button>

                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Didn&apos;t receive the email? Check your spam folder or try resending.
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Wrong email address?{' '}
                  <button 
                    onClick={() => {
                      setEmailSent(false)
                      setMessage('')
                      setError('')
                    }}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Go back
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Signup() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
} 