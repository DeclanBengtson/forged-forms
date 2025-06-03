import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">❌</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Error
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, we couldn&apos;t log you in. The magic link may have expired or been used already.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Link>
            
            <Link
              href="/"
              className="block w-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 