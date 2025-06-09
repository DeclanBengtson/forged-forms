import { Template } from '@/types/Template';

export const businessTemplates: Template[] = [
  {
    id: 'contact-form',
    title: 'Contact Form',
    description: 'A comprehensive contact form with name, email, subject, and message fields. Perfect for business websites and portfolios.',
    category: 'Business',
    code: `<form action="https://forgedforms.com/api/forms/{form-id}/submit" method="POST" class="max-w-lg mx-auto space-y-6">
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
</form>`
  },
  {
    id: 'lead-generation-form',
    title: 'Lead Generation Form',
    description: 'Capture qualified leads with budget information and project details. Ideal for agencies and service providers.',
    category: 'Business',
    code: `<form action="https://forgedforms.com/api/forms/{form-id}/submit" method="POST" class="max-w-lg mx-auto space-y-6">
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
</form>`
  },
  {
    id: 'support-request',
    title: 'Support Request',
    description: 'A detailed support form with priority levels and categories. Perfect for customer service teams.',
    category: 'Business',
    code: `<form action="https://forgedforms.com/api/forms/{form-id}/submit" method="POST" class="max-w-2xl mx-auto space-y-6">
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
</form>`
  }
]; 