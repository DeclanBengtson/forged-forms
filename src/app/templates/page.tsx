"use client";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import CopyButton from "@/components/CopyButton";
import { useState } from 'react';

// Component to safely render HTML forms
const FormPreview = ({ code }: { code: string }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Example Form
          </div>
        </div>
        <div 
          dangerouslySetInnerHTML={{ __html: code }}
          className="form-preview"
        />
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This form connects to your ForgedForms endpoint
          </p>
        </div>
      </div>
    </div>
  );
};

const TemplateCard = ({ title, description, code, category }: {
  title: string;
  description: string;
  code: string;
  category: string;
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className="mb-12" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">{title}</h3>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
      
      <div className="relative">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'code'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Code
            </button>
          </div>
          
          {activeTab === 'code' && <CopyButton code={code} />}
        </div>

        {/* Content */}
        {activeTab === 'preview' ? (
          <FormPreview code={code} />
        ) : (
          <div className="bg-gray-900 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 dark:bg-gray-700 border-b border-gray-700 dark:border-gray-600">
              <span className="text-xs font-medium text-gray-300">HTML</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Templates() {
  const contactFormCode = `<form onsubmit="event.preventDefault(); alert('This is just an example form - replace with your ForgedForms endpoint!');" class="max-w-lg mx-auto space-y-6">
  <div>
    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
    <input 
      id="name" 
      name="name" 
      type="text" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="John Doe"
    />
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
    <input 
      id="email" 
      name="email" 
      type="email" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="john@example.com"
    />
  </div>
  
  <div>
    <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
    <input 
      id="subject" 
      name="subject" 
      type="text"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="How can we help?"
    />
  </div>
  
  <div>
    <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
    <textarea 
      id="message" 
      name="message" 
      rows="5" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      placeholder="Your message here..."
    ></textarea>
  </div>
  
  <button 
    type="submit"
    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
  >
    Send Message
  </button>
</form>`;

  const newsletterCode = `<form onsubmit="event.preventDefault(); alert('This is just an example form - replace with your ForgedForms endpoint!');" class="max-w-md mx-auto">
  <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
    <h3 class="text-2xl font-bold mb-4">Stay Updated</h3>
    <p class="mb-6 opacity-90">Get the latest news and updates delivered to your inbox.</p>
    
    <div class="space-y-4">
      <input 
        name="email" 
        type="email" 
        required
        class="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50"
        placeholder="Enter your email"
      />
      
      <input type="hidden" name="_subject" value="New Newsletter Subscription" />
      <input type="hidden" name="source" value="website" />
      
      <button 
        type="submit"
        class="w-full bg-white text-blue-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Subscribe Now
      </button>
    </div>
    
    <p class="text-xs mt-4 opacity-75">
      We respect your privacy. Unsubscribe at any time.
    </p>
  </div>
</form>`;

  const feedbackCode = `<form onsubmit="event.preventDefault(); alert('This is just an example form - replace with your ForgedForms endpoint!');" class="max-w-2xl mx-auto space-y-6">
  <div class="text-center mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-2">How was your experience?</h3>
    <p class="text-gray-600">Your feedback helps us improve our service.</p>
  </div>
  
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">Overall Rating</label>
    <div class="flex space-x-2">
      <input type="radio" id="rating-5" name="rating" value="5" class="sr-only" />
      <label for="rating-5" class="cursor-pointer text-2xl hover:text-yellow-400 transition-colors">⭐</label>
      
      <input type="radio" id="rating-4" name="rating" value="4" class="sr-only" />
      <label for="rating-4" class="cursor-pointer text-2xl hover:text-yellow-400 transition-colors">⭐</label>
      
      <input type="radio" id="rating-3" name="rating" value="3" class="sr-only" />
      <label for="rating-3" class="cursor-pointer text-2xl hover:text-yellow-400 transition-colors">⭐</label>
      
      <input type="radio" id="rating-2" name="rating" value="2" class="sr-only" />
      <label for="rating-2" class="cursor-pointer text-2xl hover:text-yellow-400 transition-colors">⭐</label>
      
      <input type="radio" id="rating-1" name="rating" value="1" class="sr-only" />
      <label for="rating-1" class="cursor-pointer text-2xl hover:text-yellow-400 transition-colors">⭐</label>
    </div>
  </div>
  
  <div>
    <label for="feedback" class="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
    <textarea 
      id="feedback" 
      name="feedback" 
      rows="4" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      placeholder="Tell us about your experience..."
    ></textarea>
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
    <input 
      id="email" 
      name="email" 
      type="email"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="your@email.com"
    />
    <p class="text-xs text-gray-500 mt-1">We'll only use this to follow up if needed.</p>
  </div>
  
  <button 
    type="submit"
    class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
  >
    Submit Feedback
  </button>
</form>`;

  const supportCode = `<form onsubmit="event.preventDefault(); alert('This is just an example form - replace with your ForgedForms endpoint!');" class="max-w-2xl mx-auto space-y-6">
  <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
    <div class="flex">
      <div class="text-red-400 mr-3">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <div>
        <h3 class="text-sm font-medium text-red-800">Need help? We're here for you!</h3>
        <p class="mt-1 text-sm text-red-700">Please provide as much detail as possible so we can assist you quickly.</p>
      </div>
    </div>
  </div>
  
  <div>
    <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
    <select 
      id="priority" 
      name="priority" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select priority level</option>
      <option value="low">Low - General question</option>
      <option value="medium">Medium - Issue affecting workflow</option>
      <option value="high">High - Service disruption</option>
      <option value="urgent">Urgent - Critical issue</option>
    </select>
  </div>
  
  <div>
    <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label>
    <select 
      id="category" 
      name="category" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select a category</option>
      <option value="technical">Technical Issue</option>
      <option value="billing">Billing Question</option>
      <option value="feature">Feature Request</option>
      <option value="bug">Bug Report</option>
      <option value="other">Other</option>
    </select>
  </div>
  
  <div>
    <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
    <input 
      id="subject" 
      name="subject" 
      type="text" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Brief description of your issue"
    />
  </div>
  
  <div>
    <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
    <textarea 
      id="description" 
      name="description" 
      rows="6" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      placeholder="Please describe your issue in detail, including any error messages and steps you've already tried..."
    ></textarea>
  </div>
  
  <div>
    <label for="contact_email" class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
    <input 
      id="contact_email" 
      name="contact_email" 
      type="email" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="your@email.com"
    />
  </div>
  
  <input type="hidden" name="_subject" value="New Support Request" />
  
  <button 
    type="submit"
    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
  >
    Submit Support Request
  </button>
</form>`;

  const surveyCode = `<form onsubmit="event.preventDefault(); alert('This is just an example form - replace with your ForgedForms endpoint!');" class="max-w-3xl mx-auto space-y-8">
  <div class="text-center mb-8">
    <h3 class="text-3xl font-bold text-gray-900 mb-4">Product Survey</h3>
    <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4 rounded-full"></div>
    <p class="text-gray-600">Help us understand your needs and improve our product.</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-6">
    <div>
      <label for="first_name" class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
      <input 
        id="first_name" 
        name="first_name" 
        type="text" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="John"
      />
    </div>
    
    <div>
      <label for="last_name" class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
      <input 
        id="last_name" 
        name="last_name" 
        type="text" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Doe"
      />
    </div>
  </div>
  
  <div>
    <label for="role" class="block text-sm font-medium text-gray-700 mb-2">What's your role?</label>
    <select 
      id="role" 
      name="role" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select your role</option>
      <option value="developer">Developer</option>
      <option value="designer">Designer</option>
      <option value="product_manager">Product Manager</option>
      <option value="founder">Founder/CEO</option>
      <option value="marketer">Marketer</option>
      <option value="other">Other</option>
    </select>
  </div>
  
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">How often do you use form services?</label>
    <div class="space-y-2">
      <label class="flex items-center">
        <input type="radio" name="usage_frequency" value="daily" class="text-blue-600 focus:ring-blue-500" />
        <span class="ml-3 text-gray-700">Daily</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="usage_frequency" value="weekly" class="text-blue-600 focus:ring-blue-500" />
        <span class="ml-3 text-gray-700">Weekly</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="usage_frequency" value="monthly" class="text-blue-600 focus:ring-blue-500" />
        <span class="ml-3 text-gray-700">Monthly</span>
      </label>
      <label class="flex items-center">
        <input type="radio" name="usage_frequency" value="rarely" class="text-blue-600 focus:ring-blue-500" />
        <span class="ml-3 text-gray-700">Rarely</span>
      </label>
    </div>
  </div>
  
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">Which features are most important to you? (Select all that apply)</label>
    <div class="grid md:grid-cols-2 gap-3">
      <label class="flex items-center">
        <input type="checkbox" name="important_features" value="ease_of_use" class="text-blue-600 focus:ring-blue-500 rounded" />
        <span class="ml-3 text-gray-700">Ease of use</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" name="important_features" value="customization" class="text-blue-600 focus:ring-blue-500 rounded" />
        <span class="ml-3 text-gray-700">Customization options</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" name="important_features" value="analytics" class="text-blue-600 focus:ring-blue-500 rounded" />
        <span class="ml-3 text-gray-700">Analytics & reporting</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" name="important_features" value="integrations" class="text-blue-600 focus:ring-blue-500 rounded" />
        <span class="ml-3 text-gray-700">Third-party integrations</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" name="important_features" value="security" class="text-blue-600 focus:ring-blue-500 rounded" />
        <span class="ml-3 text-gray-700">Security features</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" name="important_features" value="pricing" class="text-blue-600 focus:ring-blue-500 rounded" />
        <span class="ml-3 text-gray-700">Affordable pricing</span>
      </label>
    </div>
  </div>
  
  <div>
    <label for="suggestions" class="block text-sm font-medium text-gray-700 mb-2">Any suggestions or additional comments?</label>
    <textarea 
      id="suggestions" 
      name="suggestions" 
      rows="4"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      placeholder="Share your thoughts with us..."
    ></textarea>
  </div>
  
  <input type="hidden" name="_subject" value="New Product Survey Response" />
  
  <button 
    type="submit"
    class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
  >
    Submit Survey
  </button>
</form>`;

  const leadGenerationCode = `<form onsubmit="event.preventDefault(); alert('This is just an example form - replace with your ForgedForms endpoint!');" class="max-w-lg mx-auto space-y-6">
  <div class="text-center mb-6">
    <h3 class="text-2xl font-bold text-gray-900 mb-2">Get Your Free Quote</h3>
    <p class="text-gray-600">Tell us about your project and we'll get back to you within 24 hours.</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <label for="first_name" class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
      <input 
        id="first_name" 
        name="first_name" 
        type="text" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="John"
      />
    </div>
    
    <div>
      <label for="last_name" class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
      <input 
        id="last_name" 
        name="last_name" 
        type="text" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Doe"
      />
    </div>
  </div>
  
  <div>
    <label for="company" class="block text-sm font-medium text-gray-700 mb-2">Company</label>
    <input 
      id="company" 
      name="company" 
      type="text" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Your Company"
    />
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
    <input 
      id="email" 
      name="email" 
      type="email" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="john@company.com"
    />
  </div>
  
  <div>
    <label for="budget" class="block text-sm font-medium text-gray-700 mb-2">Project Budget</label>
    <select 
      id="budget" 
      name="budget" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select budget range</option>
      <option value="under-5k">Under $5,000</option>
      <option value="5k-15k">$5,000 - $15,000</option>
      <option value="15k-50k">$15,000 - $50,000</option>
      <option value="50k-plus">$50,000+</option>
    </select>
  </div>
  
  <div>
    <label for="project_details" class="block text-sm font-medium text-gray-700 mb-2">Project Details</label>
    <textarea 
      id="project_details" 
      name="project_details" 
      rows="4" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      placeholder="Tell us about your project requirements..."
    ></textarea>
  </div>
  
  <input type="hidden" name="_subject" value="New Lead Generation Form" />
  
  <button 
    type="submit"
    class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
  >
    Get My Free Quote
  </button>
</form>`;

  const eventRegistrationCode = `<form onsubmit="event.preventDefault(); alert('This is just an example form - replace with your ForgedForms endpoint!');" class="max-w-2xl mx-auto space-y-6">
  <div class="text-center mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-2">Event Registration</h3>
    <p class="text-gray-600">Register for our upcoming conference and secure your spot.</p>
  </div>
  
  <div class="grid md:grid-cols-2 gap-6">
    <div>
      <label for="first_name" class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
      <input 
        id="first_name" 
        name="first_name" 
        type="text" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="John"
      />
    </div>
    
    <div>
      <label for="last_name" class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
      <input 
        id="last_name" 
        name="last_name" 
        type="text" 
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Doe"
      />
    </div>
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
    <input 
      id="email" 
      name="email" 
      type="email" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="john@example.com"
    />
  </div>
  
  <div>
    <label for="company" class="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
    <input 
      id="company" 
      name="company" 
      type="text"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Your Company"
    />
  </div>
  
  <div>
    <label for="job_title" class="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
    <input 
      id="job_title" 
      name="job_title" 
      type="text"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Your Job Title"
    />
  </div>
  
  <div>
    <label for="ticket_type" class="block text-sm font-medium text-gray-700 mb-2">Ticket Type</label>
    <select 
      id="ticket_type" 
      name="ticket_type" 
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select ticket type</option>
      <option value="early-bird">Early Bird - $99</option>
      <option value="standard">Standard - $149</option>
      <option value="vip">VIP - $299</option>
      <option value="student">Student - $49</option>
    </select>
  </div>
  
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">Dietary Restrictions</label>
    <div class="space-y-2">
      <label class="flex items-center">
        <input type="checkbox" name="dietary_restrictions" value="vegetarian" class="text-blue-600 focus:ring-blue-500 rounded" />
        <span class="ml-3 text-gray-700">Vegetarian</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" name="dietary_restrictions" value="vegan" class="text-blue-600 focus:ring-blue-500 rounded" />
        <span class="ml-3 text-gray-700">Vegan</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" name="dietary_restrictions" value="gluten-free" class="text-blue-600 focus:ring-blue-500 rounded" />
        <span class="ml-3 text-gray-700">Gluten-free</span>
      </label>
      <label class="flex items-center">
        <input type="checkbox" name="dietary_restrictions" value="none" class="text-blue-600 focus:ring-blue-500 rounded" />
        <span class="ml-3 text-gray-700">None</span>
      </label>
    </div>
  </div>
  
  <input type="hidden" name="_subject" value="New Event Registration" />
  
  <button 
    type="submit"
    class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
  >
    Register for Event
  </button>
</form>`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navigation />
      
      {/* Simplified Hero Section */}
      <section className="pt-20 pb-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white mb-4">
              Form Templates
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Ready-to-use form templates for common use cases. Copy, customize, and deploy in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Templates Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <nav className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Categories</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Business</h4>
                      <div className="space-y-1 ml-3">
                        <a href="#contact-form" className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-1 transition-colors">
                          Contact Form
                        </a>
                        <a href="#lead-generation-form" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                          Lead Generation
                        </a>
                        <a href="#support-request" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                          Support Request
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Marketing</h4>
                      <div className="space-y-1 ml-3">
                        <a href="#newsletter-signup" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                          Newsletter Signup
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Research</h4>
                      <div className="space-y-1 ml-3">
                        <a href="#feedback-form" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                          Feedback Form
                        </a>
                        <a href="#product-survey" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                          Product Survey
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Events</h4>
                      <div className="space-y-1 ml-3">
                        <a href="#event-registration" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors">
                          Event Registration
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <a href="/documentation" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors border-t border-gray-200 dark:border-gray-700 pt-3 mt-4">
                    Documentation
                  </a>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-16">
                
                <TemplateCard 
                  title="Contact Form"
                  description="A comprehensive contact form with name, email, subject, and message fields. Perfect for business websites and portfolios."
                  code={contactFormCode}
                  category="Business"
                />
                
                <TemplateCard 
                  title="Lead Generation Form"
                  description="Capture qualified leads with budget information and project details. Ideal for agencies and service providers."
                  code={leadGenerationCode}
                  category="Business"
                />
                
                <TemplateCard 
                  title="Newsletter Signup"
                  description="A beautiful newsletter subscription form with gradient styling. Great for building your email list."
                  code={newsletterCode}
                  category="Marketing"
                />
                
                <TemplateCard 
                  title="Feedback Form"
                  description="Collect user feedback with ratings and comments. Ideal for product feedback and service reviews."
                  code={feedbackCode}
                  category="Research"
                />
                
                <TemplateCard 
                  title="Support Request"
                  description="A detailed support form with priority levels and categories. Perfect for customer service teams."
                  code={supportCode}
                  category="Business"
                />
                
                <TemplateCard 
                  title="Product Survey"
                  description="A comprehensive survey form with multiple question types. Great for market research and user insights."
                  code={surveyCode}
                  category="Research"
                />
                
                <TemplateCard 
                  title="Event Registration"
                  description="Complete event registration form with ticket selection and dietary preferences. Perfect for conferences and events."
                  code={eventRegistrationCode}
                  category="Events"
                />
                
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 