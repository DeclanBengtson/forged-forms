import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Documentation
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Complete setup instructions, API reference, and troubleshooting guides to help you integrate ForgedForms into your projects.
            </p>
          </div>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Navigation</h3>
                  <nav className="space-y-2">
                    <a href="#getting-started" className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                      Getting Started
                    </a>
                    <a href="#basic-setup" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Basic Setup
                    </a>
                    <a href="#api-reference" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      API Reference
                    </a>
                    <a href="#customization" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Customization
                    </a>
                    <a href="#features" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Features
                    </a>
                    <a href="#troubleshooting" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Troubleshooting
                    </a>
                    <a href="/templates" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border-t border-gray-200 dark:border-gray-700 pt-2 mt-4">
                      Form Templates
                    </a>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                
                {/* Getting Started */}
                <div id="getting-started" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Getting Started</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      ForgedForms makes it incredibly simple to handle form submissions without any backend code. 
                      Follow these steps to get up and running in minutes.
                    </p>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Create Your Account</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Sign up for ForgedForms using our secure magic link authentication system. No passwords required!
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            💡 <strong>Tip:</strong> Simply enter your email and we&apos;ll send you a secure magic link to sign in. No need to remember another password!
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Create Your First Form</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Once logged in, create a new form project from your dashboard. Give it a meaningful name like &quot;Contact Form&quot; or &quot;Newsletter Signup&quot;.
                        </p>
                        <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                          <li>Set up email notifications</li>
                          <li>Configure your notification email address</li>
                          <li>Add a description for easy identification</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Get Your Form Endpoint</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Copy your unique form endpoint URL from the dashboard. It will look something like:
                        </p>
                        <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg mt-4">
                          <code className="text-green-400 text-sm">
                            https://forgedforms.com/api/forms/your-form-id
                          </code>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Start Collecting Submissions</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Point your HTML form to the endpoint and start receiving submissions in your dashboard with instant email notifications!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Setup */}
                <div id="basic-setup" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Basic Setup</h2>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">HTML Form</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      The simplest way to use ForgedForms is with a standard HTML form:
                    </p>
                    
                    <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 mb-6">
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`<form action="https://forgedforms.com/api/forms/your-form-id" method="POST">
  <input name="name" type="text" placeholder="Your Name" required />
  <input name="email" type="email" placeholder="Email Address" required />
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send Message</button>
</form>`}
                      </pre>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">React/Next.js Example</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      For React applications, you can handle form submissions with JavaScript:
                    </p>
                    
                    <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 mb-6">
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`const ContactForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const response = await fetch('https://forgedforms.com/api/forms/your-form-id', {
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

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">JSON Submissions</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You can also send JSON data directly:
                    </p>
                    
                    <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 mb-6">
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`const submitForm = async (data) => {
  const response = await fetch('https://forgedforms.com/api/forms/your-form-id', {
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

                {/* API Reference */}
                <div id="api-reference" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">API Reference</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Submit Form Data</h3>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                          <code className="text-blue-800 dark:text-blue-200 font-mono">
                            POST https://forgedforms.com/api/forms/{'{form-id}'}
                          </code>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Content Types Supported:</h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-4">
                          <li><code>application/x-www-form-urlencoded</code> (HTML forms)</li>
                          <li><code>multipart/form-data</code> (File uploads)</li>
                          <li><code>application/json</code> (JSON data)</li>
                        </ul>
                        
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Success Response:</h4>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 mb-4">
                          <pre className="text-green-400 text-sm">
{`{
  "success": true,
  "message": "Form submitted successfully",
  "submissionId": "sub_1234567890"
}`}
                          </pre>
                        </div>

                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rate Limiting:</h4>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                            API requests are rate-limited based on your subscription tier. Free tier allows up to 250 submissions per month.
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Error Responses</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Form Not Found (404)</h4>
                            <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                              <pre className="text-red-400 text-sm">
{`{
  "success": false,
  "error": "Form not found",
  "code": "FORM_NOT_FOUND"
}`}
                              </pre>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Rate Limited (429)</h4>
                            <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                              <pre className="text-red-400 text-sm">
{`{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customization */}
                <div id="customization" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Customization</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Redirect After Submission</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Add a hidden input field to redirect users after successful submission:
                        </p>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                          <code className="text-green-400 text-sm">
                            {`<input type="hidden" name="_redirect" value="https://yoursite.com/thank-you" />`}
                          </code>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Custom Email Subject</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Customize the email notification subject line:
                        </p>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                          <code className="text-green-400 text-sm">
                            {`<input type="hidden" name="_subject" value="New Contact Form Submission" />`}
                          </code>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Spam Protection</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Add a honeypot field to catch spam bots:
                        </p>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                          <code className="text-green-400 text-sm">
                            {`<input type="text" name="_gotcha" style="display:none" />`}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div id="features" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Features Overview</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Magic Link Authentication</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Secure, passwordless login system</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Real-time Dashboard</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Beautiful interface to manage submissions</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Email Notifications</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Instant notifications via SendGrid</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Form Analytics</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Track submissions and form performance</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Multiple Subscription Tiers</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Free, Starter, Pro, and Enterprise plans</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Secure Data Storage</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">PostgreSQL with Row Level Security</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">File Uploads</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Support for multipart/form-data</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Edge Performance</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Sub-100ms response times globally</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Troubleshooting */}
                <div id="troubleshooting" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Troubleshooting</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Common Issues</h3>
                        
                        <div className="space-y-4">
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Form not submitting</h4>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-2">
                              Make sure your form&apos;s action URL is correct and that the method is set to &quot;POST&quot;.
                            </p>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                              Check that your form ID is active in your dashboard.
                            </p>
                          </div>
                          
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Not receiving emails</h4>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-2">
                              Check your spam folder and verify your email address in the dashboard settings.
                            </p>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                              Ensure email notifications are enabled for your form.
                            </p>
                          </div>
                          
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">CORS errors</h4>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                              Our API automatically handles CORS. If you&apos;re still getting errors, make sure you&apos;re using the correct endpoint URL and your form is active.
                            </p>
                          </div>

                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Rate limit exceeded</h4>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                              You&apos;ve reached your monthly submission limit. Upgrade your plan or wait for the limit to reset next month.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Need More Help?</h3>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                            Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <a 
                              href="/contact" 
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Contact Support
                            </a>
                            <a 
                              href="/templates" 
                              className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
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
        </div>
      </section>

      <Footer />
    </div>
  );
} 