import { Template } from '@/types/Template';

export const eventsTemplates: Template[] = [
  {
    id: 'event-registration',
    title: 'Event Registration',
    description: 'Complete event registration form with ticket selection and dietary preferences. Perfect for conferences and events.',
    category: 'Events',
    code: `<form action="https://forgedforms.com/api/forms/{form-id}/submit" method="POST" class="max-w-2xl mx-auto space-y-6">
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
</form>`
  }
]; 