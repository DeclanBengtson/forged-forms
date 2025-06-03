import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            FormFlow
          </div>
          <div className="flex gap-6 items-center">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              How It Works
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Handle Form Submissions
            <span className="block text-blue-600 dark:text-blue-400">Without Backend Code</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            A lightweight, developer-friendly service that handles form submissions from any static or client-rendered website. 
            No server setup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
              Start Building Today
            </Link>
            <button className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            It&apos;s as Simple as This
          </h2>
          <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-gray-400 text-sm">index.html</span>
            </div>
            <pre className="text-green-400 font-mono text-sm leading-relaxed">
{`<form action="https://formflow.dev/api/forms/contact-form" method="POST">
  <input name="name" placeholder="Your Name" required />
  <input name="email" type="email" placeholder="Your Email" required />
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send Message</button>
</form>`}
            </pre>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Just point your form to our endpoint. That&apos;s it! ✨
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Form Endpoint
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simple POST endpoint to collect form data from any frontend framework or plain HTML.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Email Notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant email notifications whenever someone submits your form.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Simple Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                View and manage all your form submissions in one clean, organized dashboard.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Magic Link Auth
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Secure, passwordless authentication with magic links sent to your email.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">➕</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Form Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create and manage multiple named forms through an intuitive web interface.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Lightweight service designed for speed and reliability. Your forms just work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
              How It Works
            </h2>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Sign Up & Create Your Form
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Create your account with magic link authentication and set up a new form project with a custom name like &quot;contact-form&quot;.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Add the Endpoint to Your Site
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Simply point your HTML form&apos;s action attribute to our endpoint. Works with any framework or plain HTML.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Receive & Manage Submissions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Get instant email notifications and view all submissions in your dashboard. That&apos;s it - you&apos;re done!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Simplify Your Forms?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join developers who&apos;ve already simplified their form handling workflow.
          </p>
          <button className="bg-blue-600 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg">
            Get Started Free
          </button>
          <p className="text-gray-500 dark:text-gray-400 mt-4">
            No credit card required • 5 minute setup
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-blue-400 mb-4 md:mb-0">
              FormFlow
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FormFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
