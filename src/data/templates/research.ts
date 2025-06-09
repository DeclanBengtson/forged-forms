import { Template } from '@/types/Template';

export const researchTemplates: Template[] = [
  {
    id: 'feedback-form',
    title: 'Feedback Form',
    description: 'Collect user feedback with ratings and comments. Ideal for product feedback and service reviews.',
    category: 'Research',
    code: `<form action="https://forgedforms.com/api/forms/{form-id}/submit" method="POST" class="max-w-2xl mx-auto space-y-6">
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
</form>`
  },
  {
    id: 'product-survey',
    title: 'Product Survey',
    description: 'A comprehensive survey form with multiple question types. Great for market research and user insights.',
    category: 'Research',
    code: `<form action="https://forgedforms.com/api/forms/{form-id}/submit" method="POST" class="max-w-3xl mx-auto space-y-8">
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
</form>`
  }
]; 