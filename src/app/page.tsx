import Link from "next/link";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import InteractiveFeaturesComponent from "@/components/interactive-features-component";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
                Handle Form Submissions
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Without Backend Code
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                A lightweight, developer-friendly service that handles form submissions from any static or client-rendered website. 
                No server setup required, no complex configurations—just clean, simple form handling.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Building Today
                </Link>
              </div>

              <div className="inline-flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                  Just point your form to our endpoint. That&apos;s it! ✨
                </p>
              </div>
            </div>

            {/* Right Column - Simple Form Example */}
            <div className="lg:order-last">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  
                  
                  {/* Code Content */}
                  <div className="p-4 font-mono text-sm bg-slate-900 dark:bg-slate-950 overflow-x-auto">
                    <div className="space-y-1 min-w-0">
                      <div className="break-all">
                        <span className="text-rose-400">{'<form'}</span>{' '}
                        <span className="text-emerald-400">action=</span>
                        <span className="text-amber-300">{'"https://forgedforms.com/api/forms/{form_id}/submit"'}</span>{' '}
                        <span className="text-emerald-400">method=</span>
                        <span className="text-amber-300">{'"post"'}</span>
                        <span className="text-rose-400">{'>'}</span>
                      </div>
                      <div className="pl-2 break-all">
                        <span className="text-rose-400">{'<label'}</span>{' '}
                        <span className="text-emerald-400">for=</span>
                        <span className="text-amber-300">{'"email"'}</span>
                        <span className="text-rose-400">{'>'}</span>
                        <span className="text-slate-100">Your Email</span>
                        <span className="text-rose-400">{'</label>'}</span>
                      </div>
                      <div className="pl-2 break-all">
                        <span className="text-rose-400">{'<input'}</span>{' '}
                        <span className="text-emerald-400">name=</span>
                        <span className="text-amber-300">{'"email"'}</span>{' '}
                        <span className="text-emerald-400">id=</span>
                        <span className="text-amber-300">{'"email"'}</span>{' '}
                        <span className="text-emerald-400">type=</span>
                        <span className="text-amber-300">{'"email"'}</span>
                        <span className="text-rose-400">{'>'}</span>
                      </div>
                      <div className="pl-2 break-all">
                        <span className="text-rose-400">{'<button'}</span>{' '}
                        <span className="text-emerald-400">type=</span>
                        <span className="text-amber-300">{'"submit"'}</span>
                        <span className="text-rose-400">{'>'}</span>
                        <span className="text-slate-100">Submit</span>
                        <span className="text-rose-400">{'</button>'}</span>
                      </div>
                      <div className="break-all"><span className="text-rose-400">{'</form>'}</span></div>
                    </div>
                  </div>
                  
                  {/* Bottom Highlight */}
                  <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">That&apos;s it! No backend required.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Features that<br />
              you need.
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Stop building the same contact forms over and over.<br />
              Focus on what makes you money, not form backends.<br />
              Ship faster. Bill more. Stress less.
            </p>
          </div>

          {/* Interactive Features Component */}
          <InteractiveFeaturesComponent />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Seriously, It&apos;s This Simple
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              No webpack configs. No database migrations. No server deployments.
            </p>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              Just copy, paste, done. ⚡
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  number: "1",
                  title: "Copy Your Endpoint",
                  description: "Sign up, create a form, copy the URL. Takes 30 seconds max.",
                  time: "30 seconds",
                  code: `action="forgedforms.com/f/abc123"`,
                  color: "blue",
                  icon: "📋"
                },
                {
                  number: "2", 
                  title: "Paste Into Your Form",
                  description: "Replace your old action URL. Works with any framework or plain HTML.",
                  time: "10 seconds",
                  code: `method="post" // That's it!`,
                  color: "green",
                  icon: "🎯"
                },
                {
                  number: "3",
                  title: "Ship & Get Paid",
                  description: "Deploy your site. Invoice your client. Forms just work. Forever.",
                  time: "∞ money",
                  code: `// No maintenance required`,
                  color: "purple",
                  icon: "🚀"
                }
                             ].map((step, index) => (
                 <div key={index} className="group h-full">
                   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 relative overflow-hidden h-full flex flex-col">
                    
                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${
                      step.color === 'blue' ? 'from-blue-500/10 to-cyan-500/10' :
                      step.color === 'green' ? 'from-green-500/10 to-emerald-500/10' :
                      'from-purple-500/10 to-pink-500/10'
                    } rounded-full -translate-y-16 translate-x-16`}></div>
                    
                    {/* Step number and icon */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-r ${
                        step.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                        step.color === 'green' ? 'from-green-500 to-emerald-500' :
                        'from-purple-500 to-pink-500'
                      } rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white text-xl font-bold">{step.number}</span>
                      </div>
                      <div className="text-2xl">{step.icon}</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    
                                         <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-grow">
                       {step.description}
                     </p>
                     
                     {/* Code snippet */}
                     <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
                       <code className="text-green-400">{step.code}</code>
                     </div>
                     
                     {/* Time indicator */}
                     <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                       step.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                       step.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                       'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                     }`}>
                       <span>⏱️</span>
                       <span>{step.time}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Bottom CTA */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-6 py-3 rounded-full border border-green-200 dark:border-green-800 mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Total setup time: Less than 2 minutes
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Seriously. Your coffee will still be hot. ☕
              </p>
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
