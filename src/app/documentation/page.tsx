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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <nav className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Contents</h3>
                  <a href="#getting-started" className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-1 transition-colors">
                    Getting Started
                  </a>
                  <a href="#basic-setup" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                    Basic Setup
                  </a>
                  <a href="#api-reference" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                    API Reference
                  </a>
                  <a href="#customization" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                    Customization
                  </a>
                  <a href="#features" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                    Features
                  </a>
                  <a href="#troubleshooting" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                    Troubleshooting
                  </a>
                  <a href="/templates" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors border-t border-gray-200 dark:border-gray-700 pt-3 mt-4">
                    Form Templates
                  </a>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-gray dark:prose-invert prose-lg max-w-none">
                
                {/* Getting Started */}
                <div id="getting-started" className="mb-16">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Getting Started</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-base leading-relaxed">
                    ForgedForms makes it incredibly simple to handle form submissions without any backend code. 
                    Follow these steps to get up and running in minutes.
                  </p>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mr-3">1</span>
                        Create Your Account
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 ml-9">
                        Sign up for ForgedForms by pressing the Get Started button above.
                      </p>
                      
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mr-3">2</span>
                        Create Your First Form
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 ml-9">
                        Once logged in, create a new form project from your dashboard. Give it a meaningful name like &ldquo;Contact Form&rdquo; or &ldquo;Newsletter Signup&rdquo;.
                      </p>
                      <ul className="text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1 ml-9">
                        <li>Set up email notifications</li>
                        <li>Configure your notification email address</li>
                        <li>Add a description for easy identification</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mr-3">3</span>
                        Get Your Form Endpoint
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 ml-9">
                        Copy your unique form endpoint URL from the dashboard. It will look something like:
                      </p>
                      <div className="bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg ml-9">
                        <code className="text-green-400 text-sm font-mono">
                          https://forgedforms.com/api/forms/{'{form-id}'}/submit
                        </code>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mr-3">4</span>
                        Start Collecting Submissions
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 ml-9">
                        Point your HTML form to the endpoint and start receiving submissions in your dashboard with instant email notifications!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Setup */}
                <div id="basic-setup" className="mb-16">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Basic Setup</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">HTML Form</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        The simplest way to use ForgedForms is with a standard HTML form:
                      </p>
                      
                      <div className="bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <pre className="text-green-400 text-sm overflow-x-auto font-mono">
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
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">React/Next.js Example</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        For React applications, you can handle form submissions with JavaScript:
                      </p>
                      
                      <div className="bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <pre className="text-green-400 text-sm overflow-x-auto font-mono">
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
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">JSON Submissions</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You can also send JSON data directly:
                      </p>
                      
                      <div className="bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <pre className="text-green-400 text-sm overflow-x-auto font-mono">
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
                <div id="troubleshooting" className="mb-16">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Troubleshooting</h2>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Common Issues</h3>
                    
                    <div className="space-y-4">
                      <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 rounded-lg p-4">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Form not submitting</h4>
                        <div className="text-amber-800 dark:text-amber-200 text-sm space-y-1">
                          <p>• Make sure your form&apos;s action URL is correct and that the method is set to &ldquo;POST&rdquo;.</p>
                          <p>• Check that your form ID is active in your dashboard.</p>
                        </div>
                      </div>
                      
                      <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 rounded-lg p-4">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Not receiving emails</h4>
                        <div className="text-amber-800 dark:text-amber-200 text-sm space-y-1">
                          <p>• Check your spam folder and verify your email address in the dashboard settings.</p>
                          <p>• Ensure email notifications are enabled for your form.</p>
                        </div>
                      </div>
                      
                      <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 rounded-lg p-4">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">CORS errors</h4>
                        <p className="text-amber-800 dark:text-amber-200 text-sm">
                          Our API automatically handles CORS. If you&apos;re still getting errors, make sure you&apos;re using the correct endpoint URL and your form is active.
                        </p>
                      </div>

                      <div className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 rounded-lg p-4">
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Rate limit exceeded</h4>
                        <p className="text-amber-800 dark:text-amber-200 text-sm">
                          You&apos;ve reached your monthly submission limit. Upgrade your plan or wait for the limit to reset next month.
                        </p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Need More Help?</h3>
                      <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
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