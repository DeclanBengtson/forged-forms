import Link from "next/link";
import Navigation from "@/components/navigation";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Documentation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know to start handling form submissions with ForgedForms
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-32 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contents</h3>
                <nav className="space-y-2 text-sm">
                  <a href="#getting-started" className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Getting Started</a>
                  <a href="#creating-forms" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Creating Forms</a>
                  <a href="#html-integration" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">HTML Integration</a>
                  <a href="#javascript-integration" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">JavaScript Integration</a>
                  <a href="#react-integration" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">React Integration</a>
                  <a href="#configuration" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Configuration</a>
                  <a href="#api-reference" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">API Reference</a>
                  <a href="#managing-submissions" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Managing Submissions</a>
                  <a href="#security" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Security</a>
                  <a href="#troubleshooting" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Troubleshooting</a>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="prose prose-lg max-w-none">
                
                {/* Getting Started */}
                <section id="getting-started" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        🚀
                      </span>
                      Getting Started
                    </h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300">
                        ForgedForms is a simple form handling service that processes form submissions from any website without requiring backend code. Here's how to get started in just a few minutes.
                      </p>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Quick Setup</h3>
                        <ol className="space-y-2 text-blue-800 dark:text-blue-200">
                          <li>1. <Link href="/signup" className="underline hover:no-underline">Create your free account</Link></li>
                          <li>2. Create a new form in your dashboard</li>
                          <li>3. Copy the provided endpoint URL</li>
                          <li>4. Point your HTML form to this endpoint</li>
                          <li>5. Start receiving submissions!</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Creating Forms */}
                <section id="creating-forms" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                        📝
                      </span>
                      Creating Forms
                    </h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300">
                        Once you're logged in to your dashboard, creating a form is straightforward:
                      </p>
                      
                      <div className="space-y-4">
                        <div className="border-l-4 border-green-500 pl-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Step 1: Create a New Form</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Click "New Form" in your dashboard and give your form a descriptive name (e.g., "Contact Form", "Newsletter Signup").
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-green-500 pl-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Step 2: Configure Settings</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Set up email notifications, redirect URLs, and other preferences in the form settings.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-green-500 pl-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Step 3: Get Your Endpoint</h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            Copy the generated endpoint URL - this is what you'll use in your form's action attribute.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* HTML Integration */}
                <section id="html-integration" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-3">
                        📄
                      </span>
                      HTML Integration
                    </h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300">
                        The simplest way to use ForgedForms is with a standard HTML form. Just point your form's action to your endpoint URL.
                      </p>
                      
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 overflow-x-auto">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="ml-4 text-gray-400 text-sm font-mono">contact-form.html</span>
                        </div>
                        <pre className="text-green-400 font-mono text-sm">
{`<form action="https://forgedforms.dev/api/forms/your-form-slug" method="POST">
  <!-- Basic contact form -->
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
  </div>
  
  <div>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <div>
    <label for="message">Message:</label>
    <textarea id="message" name="message" required></textarea>
  </div>
  
  <!-- Optional: Redirect after submission -->
  <input type="hidden" name="_redirect" value="https://yoursite.com/thank-you">
  
  <button type="submit">Send Message</button>
</form>`}
                        </pre>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">💡 Pro Tip</h4>
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                          Replace "your-form-slug" with the actual slug from your form's endpoint URL. You can find this in your dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* JavaScript Integration */}
                <section id="javascript-integration" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mr-3">
                        ⚡
                      </span>
                      JavaScript Integration
                    </h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300">
                        For more control over the submission process, you can use JavaScript to submit forms via AJAX/fetch.
                      </p>
                      
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 overflow-x-auto">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="ml-4 text-gray-400 text-sm font-mono">form-handler.js</span>
                        </div>
                        <pre className="text-green-400 font-mono text-sm">
{`// Handle form submission with JavaScript
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  try {
    const response = await fetch('https://forgedforms.dev/api/forms/your-form-slug', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      // Success - show confirmation message
      alert('Thank you! Your message has been sent.');
      form.reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    // Error handling
    alert('Sorry, there was an error sending your message. Please try again.');
    console.error('Form submission error:', error);
  }
}

// Attach to your form
document.getElementById('contact-form').addEventListener('submit', handleFormSubmit);`}
                        </pre>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📝 JSON Submissions</h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                          You can also send JSON data by setting the Content-Type header:
                        </p>
                        <pre className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded text-blue-900 dark:text-blue-100 text-xs font-mono overflow-x-auto">
{`fetch('https://forgedforms.dev/api/forms/your-form-slug', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
})`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </section>

                {/* React Integration */}
                <section id="react-integration" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        ⚛️
                      </span>
                      React Integration
                    </h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300">
                        Here's how to integrate ForgedForms with a React component:
                      </p>
                      
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 overflow-x-auto">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="ml-4 text-gray-400 text-sm font-mono">ContactForm.jsx</span>
                        </div>
                        <pre className="text-green-400 font-mono text-sm">
{`import { useState } from 'react';

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);

    try {
      const response = await fetch(
        'https://forgedforms.dev/api/forms/your-form-slug',
        {
          method: 'POST',
          body: formData
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
        event.target.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="success-message">
        <h3>Thank you!</h3>
        <p>Your message has been sent successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>
      
      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required />
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

export default ContactForm;`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Configuration */}
                <section id="configuration" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                        ⚙️
                      </span>
                      Configuration Options
                    </h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300">
                        You can customize form behavior using hidden fields or dashboard settings:
                      </p>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Field Name</th>
                              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Description</th>
                              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Example</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                              <td className="p-4 font-mono text-sm text-blue-600 dark:text-blue-400">_redirect</td>
                              <td className="p-4 text-gray-600 dark:text-gray-300">URL to redirect after successful submission</td>
                              <td className="p-4 font-mono text-sm text-gray-500">https://yoursite.com/thanks</td>
                            </tr>
                            <tr>
                              <td className="p-4 font-mono text-sm text-blue-600 dark:text-blue-400">_subject</td>
                              <td className="p-4 text-gray-600 dark:text-gray-300">Custom subject line for email notifications</td>
                              <td className="p-4 font-mono text-sm text-gray-500">New Contact Form Submission</td>
                            </tr>
                            <tr>
                              <td className="p-4 font-mono text-sm text-blue-600 dark:text-blue-400">_replyto</td>
                              <td className="p-4 text-gray-600 dark:text-gray-300">Reply-to email address for notifications</td>
                              <td className="p-4 font-mono text-sm text-gray-500">user@example.com</td>
                            </tr>
                            <tr>
                              <td className="p-4 font-mono text-sm text-blue-600 dark:text-blue-400">_gotcha</td>
                              <td className="p-4 text-gray-600 dark:text-gray-300">Honeypot field for spam protection (keep empty)</td>
                              <td className="p-4 font-mono text-sm text-gray-500">Leave blank</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Example with Configuration Fields:</h4>
                        <pre className="text-gray-700 dark:text-gray-300 text-sm font-mono overflow-x-auto">
{`<form action="https://forgedforms.dev/api/forms/contact" method="POST">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  
  <!-- Configuration fields -->
  <input type="hidden" name="_redirect" value="https://yoursite.com/thank-you">
  <input type="hidden" name="_subject" value="New Contact Form Message">
  <input type="hidden" name="_replyto" value="{{email}}">
  <input type="hidden" name="_gotcha" style="display:none" tabindex="-1">
  
  <button type="submit">Submit</button>
</form>`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </section>

                {/* API Reference */}
                <section id="api-reference" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-3">
                        🔌
                      </span>
                      API Reference
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submit Form Data</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 px-2 py-1 rounded text-sm font-mono">POST</span>
                            <code className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                              https://forgedforms.dev/api/forms/{`{slug}`}
                            </code>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Submit form data to your form endpoint. Accepts both form-encoded and JSON data.
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Request Headers</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Content-Type:</span>
                              <span className="font-mono text-gray-900 dark:text-white">application/x-www-form-urlencoded</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">or</span>
                              <span className="font-mono text-gray-900 dark:text-white">application/json</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Response Codes</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-green-600 dark:text-green-400">200 OK</span>
                              <span className="text-gray-600 dark:text-gray-400">Success</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-red-600 dark:text-red-400">400 Bad Request</span>
                              <span className="text-gray-600 dark:text-gray-400">Invalid data</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-red-600 dark:text-red-400">404 Not Found</span>
                              <span className="text-gray-600 dark:text-gray-400">Form not found</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-yellow-600 dark:text-yellow-400">429 Too Many</span>
                              <span className="text-gray-600 dark:text-gray-400">Rate limited</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Managing Submissions */}
                <section id="managing-submissions" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mr-3">
                        📊
                      </span>
                      Managing Submissions
                    </h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300">
                        Once your forms start receiving submissions, you can manage them through your dashboard:
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="border-l-4 border-indigo-500 pl-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">View Submissions</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              All submissions appear instantly in your dashboard with timestamps and IP addresses.
                            </p>
                          </div>
                          
                          <div className="border-l-4 border-indigo-500 pl-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Export Data</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              Export all submissions as CSV for analysis or backup purposes.
                            </p>
                          </div>
                          
                          <div className="border-l-4 border-indigo-500 pl-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Email Notifications</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              Get instant email alerts for new submissions with customizable templates.
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Dashboard Features</h4>
                          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                              Real-time submission tracking
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                              Submission statistics and analytics
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                              Search and filter submissions
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                              CSV export functionality
                            </li>
                            <li className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                              Email notification management
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Security */}
                <section id="security" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                        🔒
                      </span>
                      Security & Spam Protection
                    </h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300">
                        ForgedForms includes several security features to protect your forms from spam and abuse:
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">🛡️ Built-in Protection</h4>
                            <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
                              <li>• Rate limiting per IP address</li>
                              <li>• Honeypot spam detection</li>
                              <li>• CAPTCHA integration</li>
                              <li>• Content filtering</li>
                            </ul>
                          </div>
                          
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🎯 Honeypot Example</h4>
                            <pre className="text-blue-800 dark:text-blue-200 text-xs font-mono">
{`<input type="text" 
       name="_gotcha" 
       style="display:none" 
       tabindex="-1" 
       autocomplete="off">`}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚡ Rate Limits</h4>
                            <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
                              <li>• 10 submissions per minute per IP</li>
                              <li>• 100 submissions per hour per form</li>
                              <li>• Higher limits for verified domains</li>
                            </ul>
                          </div>
                          
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🔐 Data Privacy</h4>
                            <ul className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
                              <li>• HTTPS encryption for all data</li>
                              <li>• Optional IP address logging</li>
                              <li>• GDPR compliant data handling</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Troubleshooting */}
                <section id="troubleshooting" className="mb-16">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-3">
                        🔧
                      </span>
                      Troubleshooting
                    </h2>
                    
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300">
                        Common issues and their solutions:
                      </p>
                      
                      <div className="space-y-6">
                        <div className="border border-red-200 dark:border-red-800 rounded-lg p-6">
                          <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">❌ Form submissions not working</h4>
                          <div className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                            <p><strong>Check:</strong> Form action URL matches your endpoint exactly</p>
                            <p><strong>Check:</strong> Form method is set to "POST"</p>
                            <p><strong>Check:</strong> Form is active in your dashboard</p>
                            <p><strong>Check:</strong> No JavaScript errors in browser console</p>
                          </div>
                        </div>
                        
                        <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                          <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">⚠️ Not receiving email notifications</h4>
                          <div className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                            <p><strong>Check:</strong> Email notifications are enabled in form settings</p>
                            <p><strong>Check:</strong> Notification email address is correct</p>
                            <p><strong>Check:</strong> Spam folder in your email client</p>
                            <p><strong>Check:</strong> Email delivery status in dashboard</p>
                          </div>
                        </div>
                        
                        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                          <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">ℹ️ Getting rate limited</h4>
                          <div className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                            <p><strong>Cause:</strong> Too many submissions from the same IP address</p>
                            <p><strong>Solution:</strong> Wait a few minutes before trying again</p>
                            <p><strong>Prevention:</strong> Implement client-side form validation</p>
                            <p><strong>Contact:</strong> Reach out for higher rate limits if needed</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Need More Help?</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          If you're still having trouble, we're here to help! Here are your options:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Link href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Contact Support
                          </Link>
                          <Link href="/dashboard" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                            Check Dashboard
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 