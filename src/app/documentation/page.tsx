
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
              Everything you need to get started with ForgedForms and integrate it into your projects.
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
                    <a href="#examples" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Examples
                    </a>
                    <a href="#customization" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Customization
                    </a>
                    <a href="#troubleshooting" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Troubleshooting
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
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Create an Account</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Sign up for a free ForgedForms account using our magic link authentication system.
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            💡 <strong>Tip:</strong> No password required! We&apos;ll send you a secure magic link to sign in.
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Create Your First Form</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Once logged in, create a new form project and give it a meaningful name like &quot;Contact Form&quot; or &quot;Newsletter Signup&quot;.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Get Your Endpoint URL</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Copy your unique form endpoint URL from the dashboard. It will look something like:
                        </p>
                        <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg mt-4">
                          <code className="text-green-400 text-sm">
                            https://formflow.dev/api/forms/your-form-id
                          </code>
                        </div>
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
{`<form action="https://formflow.dev/api/forms/your-form-id" method="POST">
  <input name="name" type="text" placeholder="Your Name" required />
  <input name="email" type="email" placeholder="Email Address" required />
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send Message</button>
</form>`}
                      </pre>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">React/Next.js Example</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      For React applications, you can handle form submissions like this:
                    </p>
                    
                    <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 mb-6">
                      <pre className="text-green-400 text-sm overflow-x-auto">
{`const ContactForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const response = await fetch('https://formflow.dev/api/forms/your-form-id', {
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
                            POST https://formflow.dev/api/forms/{'{form-id}'}
                          </code>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Content Types Supported:</h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 mb-4">
                          <li><code>application/x-www-form-urlencoded</code> (HTML forms)</li>
                          <li><code>multipart/form-data</code> (File uploads)</li>
                          <li><code>application/json</code> (JSON data)</li>
                        </ul>
                        
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Response:</h4>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4">
                          <pre className="text-green-400 text-sm">
{`{
  "success": true,
  "message": "Form submitted successfully",
  "submissionId": "sub_1234567890"
}`}
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Error Responses</h3>
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
                    </div>
                  </div>
                </div>

                {/* Examples */}
                <div id="examples" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Examples</h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Form</h3>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6">
                          <pre className="text-green-400 text-sm overflow-x-auto">
{`<form action="https://formflow.dev/api/forms/contact-form" method="POST">
  <div>
    <label for="name">Name</label>
    <input id="name" name="name" type="text" required />
  </div>
  <div>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required />
  </div>
  <div>
    <label for="subject">Subject</label>
    <input id="subject" name="subject" type="text" />
  </div>
  <div>
    <label for="message">Message</label>
    <textarea id="message" name="message" required></textarea>
  </div>
  <button type="submit">Send Message</button>
</form>`}
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Newsletter Signup</h3>
                        <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6">
                          <pre className="text-green-400 text-sm overflow-x-auto">
{`<form action="https://formflow.dev/api/forms/newsletter" method="POST">
  <input name="email" type="email" placeholder="Enter your email" required />
  <input name="source" type="hidden" value="homepage" />
  <button type="submit">Subscribe</button>
</form>`}
                          </pre>
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
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                              Make sure your form&apos;s action URL is correct and that the method is set to &quot;POST&quot;.
                            </p>
                          </div>
                          
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Not receiving emails</h4>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                              Check your spam folder and verify your email address in the dashboard settings.
                            </p>
                          </div>
                          
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">CORS errors</h4>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                              Our API automatically handles CORS. If you&apos;re still getting errors, make sure you&apos;re using the correct endpoint URL.
                            </p>
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