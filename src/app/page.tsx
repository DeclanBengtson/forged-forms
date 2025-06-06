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
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-gray-800 dark:bg-gray-700 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-400 text-sm font-mono">contact-form.html</span>
                  <div className="w-6"></div>
                </div>
                <div className="p-6 overflow-x-auto">
                  <pre className="text-sm sm:text-base leading-relaxed">
                    <code>
                      <span className="text-gray-500">&lt;!-- Beautiful Contact Form --&gt;</span>{'\n'}
                      <span className="text-blue-400">&lt;form</span> <span className="text-green-400">action=</span><span className="text-yellow-300">&quot;https://formflow.dev/api/forms/contact&quot;</span>{'\n'}
                      <span className="text-green-400">      method=</span><span className="text-yellow-300">&quot;POST&quot;</span> <span className="text-green-400">class=</span><span className="text-yellow-300">&quot;contact-form&quot;</span><span className="text-blue-400">&gt;</span>{'\n'}
                      {'\n'}
                      <span className="text-gray-500">  &lt;!-- Name Input --&gt;</span>{'\n'}
                      <span className="text-blue-400">  &lt;div</span> <span className="text-green-400">class=</span><span className="text-yellow-300">&quot;form-group&quot;</span><span className="text-blue-400">&gt;</span>{'\n'}
                      <span className="text-blue-400">    &lt;label</span> <span className="text-green-400">for=</span><span className="text-yellow-300">&quot;name&quot;</span><span className="text-blue-400">&gt;</span><span className="text-white">Full Name</span><span className="text-blue-400">&lt;/label&gt;</span>{'\n'}
                      <span className="text-blue-400">    &lt;input</span> <span className="text-green-400">type=</span><span className="text-yellow-300">&quot;text&quot;</span> <span className="text-green-400">id=</span><span className="text-yellow-300">&quot;name&quot;</span> <span className="text-green-400">name=</span><span className="text-yellow-300">&quot;name&quot;</span>{'\n'}
                      <span className="text-green-400">           placeholder=</span><span className="text-yellow-300">&quot;Enter your full name&quot;</span> <span className="text-green-400">required</span><span className="text-blue-400">&gt;</span>{'\n'}
                      <span className="text-blue-400">  &lt;/div&gt;</span>{'\n'}
                      {'\n'}
                      <span className="text-gray-500">  &lt;!-- Email Input --&gt;</span>{'\n'}
                      <span className="text-blue-400">  &lt;div</span> <span className="text-green-400">class=</span><span className="text-yellow-300">&quot;form-group&quot;</span><span className="text-blue-400">&gt;</span>{'\n'}
                      <span className="text-blue-400">    &lt;label</span> <span className="text-green-400">for=</span><span className="text-yellow-300">&quot;email&quot;</span><span className="text-blue-400">&gt;</span><span className="text-white">Email Address</span><span className="text-blue-400">&lt;/label&gt;</span>{'\n'}
                      <span className="text-blue-400">    &lt;input</span> <span className="text-green-400">type=</span><span className="text-yellow-300">&quot;email&quot;</span> <span className="text-green-400">id=</span><span className="text-yellow-300">&quot;email&quot;</span> <span className="text-green-400">name=</span><span className="text-yellow-300">&quot;email&quot;</span>{'\n'}
                      <span className="text-green-400">           placeholder=</span><span className="text-yellow-300">&quot;your@email.com&quot;</span> <span className="text-green-400">required</span><span className="text-blue-400">&gt;</span>{'\n'}
                      <span className="text-blue-400">  &lt;/div&gt;</span>{'\n'}
                      {'\n'}
                      <span className="text-gray-500">  &lt;!-- Message Textarea --&gt;</span>{'\n'}
                      <span className="text-blue-400">  &lt;div</span> <span className="text-green-400">class=</span><span className="text-yellow-300">&quot;form-group&quot;</span><span className="text-blue-400">&gt;</span>{'\n'}
                      <span className="text-blue-400">    &lt;label</span> <span className="text-green-400">for=</span><span className="text-yellow-300">&quot;message&quot;</span><span className="text-blue-400">&gt;</span><span className="text-white">Your Message</span><span className="text-blue-400">&lt;/label&gt;</span>{'\n'}
                      <span className="text-blue-400">    &lt;textarea</span> <span className="text-green-400">id=</span><span className="text-yellow-300">&quot;message&quot;</span> <span className="text-green-400">name=</span><span className="text-yellow-300">&quot;message&quot;</span> <span className="text-green-400">rows=</span><span className="text-yellow-300">&quot;5&quot;</span>{'\n'}
                      <span className="text-green-400">              placeholder=</span><span className="text-yellow-300">&quot;Tell us about your project...&quot;</span> <span className="text-green-400">required</span><span className="text-blue-400">&gt;&lt;/textarea&gt;</span>{'\n'}
                      <span className="text-blue-400">  &lt;/div&gt;</span>{'\n'}
                      {'\n'}
                      <span className="text-gray-500">  &lt;!-- Submit Button --&gt;</span>{'\n'}
                      <span className="text-blue-400">  &lt;button</span> <span className="text-green-400">type=</span><span className="text-yellow-300">&quot;submit&quot;</span> <span className="text-green-400">class=</span><span className="text-yellow-300">&quot;submit-btn&quot;</span><span className="text-blue-400">&gt;</span>{'\n'}
                      <span className="text-white">    Send Message</span>{'\n'}
                      <span className="text-blue-400">  &lt;/button&gt;</span>{'\n'}
                      {'\n'}
                      <span className="text-blue-400">&lt;/form&gt;</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Point your form to our endpoint. That&apos;s it! ✨
                </p>
              </div>
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
