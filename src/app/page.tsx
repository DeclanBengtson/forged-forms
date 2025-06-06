import Link from "next/link";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
              Handle Form Submissions
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Without Backend Code
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              A lightweight, developer-friendly service that handles form submissions from any static or client-rendered website. 
              No server setup required, no complex configurations—just clean, simple form handling.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Building Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
            Trusted by developers from companies worldwide
          </p>
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Vercel</div>
            <div className="text-2xl font-bold text-gray-400">Netlify</div>
            <div className="text-2xl font-bold text-gray-400">GitHub</div>
            <div className="text-2xl font-bold text-gray-400">AWS</div>
          </div>
        </div>
      </section>

      {/* Code Preview */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              It&apos;s as Simple as This
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No backend setup, no complex configurations. Just point and submit.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gray-900 dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-gray-400 text-sm font-mono">contact-form.html</span>
                </div>
                <pre className="text-green-400 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto">
{`<form action="https://formflow.dev/api/forms/contact" method="POST">
  <input name="name" placeholder="Your Name" required />
  <input name="email" type="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <button type="submit">Send Message</button>
</form>`}
                </pre>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Point your form to our endpoint. That&apos;s it! ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 lg:py-24 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make form handling effortless and reliable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔗",
                title: "Simple Endpoints",
                description: "Clean REST endpoints that work with any frontend framework or plain HTML forms.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: "📧",
                title: "Email Notifications",
                description: "Get instant notifications whenever someone submits your form with customizable templates.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: "📊",
                title: "Clean Dashboard",
                description: "View and manage all submissions in a beautiful, intuitive dashboard interface.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: "🔐",
                title: "Magic Link Auth",
                description: "Secure, passwordless authentication system using magic links sent to your email.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: "⚙️",
                title: "Form Management",
                description: "Create, organize, and manage multiple forms through our intuitive web interface.",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Optimized for performance with global CDN and edge computing for instant responses.",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {[
                {
                  number: "01",
                  title: "Sign Up & Create Your Form",
                  description: "Create your account with our secure magic link authentication and set up a new form project with a custom name.",
                  color: "blue"
                },
                {
                  number: "02",
                  title: "Add the Endpoint to Your Site",
                  description: "Simply point your HTML form&apos;s action attribute to our endpoint. Works with React, Vue, vanilla HTML, or any framework.",
                  color: "green"
                },
                {
                  number: "03",
                  title: "Receive & Manage Submissions",
                  description: "Get instant email notifications and view all submissions in your beautiful dashboard. You&apos;re done!",
                  color: "purple"
                }
              ].map((step, index) => (
                <div key={index} className="flex flex-col lg:flex-row items-start gap-8">
                  <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-r ${
                    step.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                    step.color === 'green' ? 'from-green-500 to-emerald-500' :
                    'from-purple-500 to-pink-500'
                  } rounded-2xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-xl font-bold">{step.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 lg:p-16 text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Simplify Your Forms?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of developers who&apos;ve already simplified their form handling workflow with ForgedForms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/documentation"
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-200 inline-block text-center"
                >
                  View Documentation
                </Link>
              </div>
              <p className="text-white/70 mt-6">
                No credit card required • 5 minute setup • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
