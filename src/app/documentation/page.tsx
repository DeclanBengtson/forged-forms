import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      
      {/* Simplified Hero Section */}
      <section className="pt-20 pb-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white mb-4">
              Documentation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Complete setup instructions, API reference, and troubleshooting guides to help you integrate ForgedForms into your projects.
            </p>
          </div>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
                  <nav className="space-y-4 sm:space-y-6">
                    <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Contents
                      </h3>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2">
                      <a href="#getting-started" className="group flex items-center text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-all duration-200">
                        <svg className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="truncate">Getting Started</span>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-auto flex-shrink-0"></div>
                      </a>
                      
                      <a href="#basic-setup" className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-all duration-200">
                        <svg className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">Basic Setup</span>
                      </a>
                      
                      <a href="#api-reference" className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-all duration-200">
                        <svg className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="truncate">API Reference</span>
                      </a>
                      
                      <a href="#customization" className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-all duration-200">
                        <svg className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                        </svg>
                        <span className="truncate">Customization</span>
                      </a>
                      
                      <a href="#features" className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-all duration-200">
                        <svg className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="truncate">Features</span>
                      </a>
                      
                      <a href="#troubleshooting" className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-all duration-200">
                        <svg className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.18l6.364 6.364-6.364 6.364L5.636 8.544 12 2.18z" />
                        </svg>
                        <span className="truncate">Troubleshooting</span>
                      </a>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <a href="/templates" className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                        <svg className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="truncate">Form Templates</span>
                        <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-2 lg:order-1 min-w-0">
              <div className="prose prose-gray dark:prose-invert prose-base sm:prose-lg max-w-none">
                
                {/* Getting Started */}
                <div id="getting-started" className="mb-12 sm:mb-16">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Getting Started</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                    ForgedForms makes it incredibly simple to handle form submissions without any backend code. 
                    Follow these steps to get up and running in minutes.
                  </p>
                  
                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mr-3 flex-shrink-0">1</span>
                        <span>Create Your Account</span>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 ml-9 text-sm sm:text-base">
                        Sign up for ForgedForms by pressing the Get Started button above.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mr-3 flex-shrink-0">2</span>
                        <span>Create Your First Form</span>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 ml-9 text-sm sm:text-base">
                        Once logged in, create a new form project from your dashboard. Give it a meaningful name like &ldquo;Contact Form&rdquo; or &ldquo;Newsletter Signup&rdquo;.
                      </p>
                      <ul className="text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1 ml-9 text-sm sm:text-base">
                        <li>Set up email notifications</li>
                        <li>Configure your notification email address</li>
                        <li>Add a description for easy identification</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mr-3 flex-shrink-0">3</span>
                        <span>Get Your Form Endpoint</span>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 ml-9 text-sm sm:text-base">
                        Copy your unique form endpoint URL from the dashboard. It will look something like:
                      </p>
                      <div className="bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-lg ml-9 overflow-x-auto">
                        <code className="text-green-400 text-xs sm:text-sm font-mono whitespace-nowrap">
                          https://forgedforms.com/api/forms/{'{form-id}'}/submit
                        </code>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mr-3 flex-shrink-0">4</span>
                        <span>Start Collecting Submissions</span>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 ml-9 text-sm sm:text-base">
                        Point your HTML form to the endpoint and start receiving submissions in your dashboard with instant email notifications!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Setup */}
                <div id="basic-setup" className="mb-12 sm:mb-16">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Basic Setup</h2>
                  
                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">HTML Form</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                        The simplest way to use ForgedForms is with a standard HTML form:
                      </p>
                      
                      <div className="bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-6 overflow-x-auto">
                        <pre className="text-green-400 text-xs sm:text-sm font-mono whitespace-pre-wrap break-all sm:break-normal">
{`<form action="https://forgedforms.com/api/forms/{form-id}/submit" method="POST">
  <input name="name" type="text" placeholder="Your Name" required />
  <input name="email" type="email" placeholder="Email Address" required />
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send Message</button>
</form>`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">React/Next.js Example</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                        For React applications, you can handle form submissions with JavaScript:
                      </p>
                      
                      <div className="bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-6 overflow-x-auto">
                        <pre className="text-green-400 text-xs sm:text-sm font-mono whitespace-pre-wrap break-all sm:break-normal">
{`const ContactForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const response = await fetch('https://forgedforms.com/api/forms/{form-id}/submit', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      alert('Message sent successfully!');
      e.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" placeholder="Your Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required></textarea>
      <button type="submit">Send Message</button>
    </form>
  );
};`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">JSON Submissions</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                        You can also send JSON data directly:
                      </p>
                      
                      <div className="bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-6 overflow-x-auto">
                        <pre className="text-green-400 text-xs sm:text-sm font-mono whitespace-pre-wrap break-all sm:break-normal">
{`const submitForm = async (data) => {
  const response = await fetch('https://forgedforms.com/api/forms/{form-id}/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
};`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Troubleshooting */}
                <div id="troubleshooting" className="mb-12 sm:mb-16">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Troubleshooting</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Common Issues</h3>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 rounded-lg p-3 sm:p-4">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2 text-sm sm:text-base">Form not submitting</h4>
                        <div className="text-amber-800 dark:text-amber-200 text-xs sm:text-sm space-y-1">
                          <p>• Make sure your form&apos;s action URL is correct and that the method is set to &ldquo;POST&rdquo;.</p>
                          <p>• Check that your form ID is active in your dashboard.</p>
                        </div>
                      </div>
                      
                      <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 rounded-lg p-3 sm:p-4">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2 text-sm sm:text-base">Not receiving emails</h4>
                        <div className="text-amber-800 dark:text-amber-200 text-xs sm:text-sm space-y-1">
                          <p>• Check your spam folder and verify your email address in the dashboard settings.</p>
                          <p>• Ensure email notifications are enabled for your form.</p>
                        </div>
                      </div>
                      
                      <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 rounded-lg p-3 sm:p-4">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2 text-sm sm:text-base">CORS errors</h4>
                        <p className="text-amber-800 dark:text-amber-200 text-xs sm:text-sm">
                          Our API automatically handles CORS. If you&apos;re still getting errors, make sure you&apos;re using the correct endpoint URL and your form is active.
                        </p>
                      </div>

                      <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 rounded-lg p-3 sm:p-4">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2 text-sm sm:text-base">Rate limit exceeded</h4>
                        <p className="text-amber-800 dark:text-amber-200 text-xs sm:text-sm">
                          You&apos;ve reached your monthly submission limit. Upgrade your plan or wait for the limit to reset next month.
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">Need More Help?</h3>
                      <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                          Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <a 
                            href="/contact" 
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Contact Support
                          </a>
                          <a 
                            href="/templates" 
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            View Templates
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 