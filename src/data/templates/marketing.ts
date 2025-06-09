import { Template } from '@/types/Template';

export const marketingTemplates: Template[] = [
  {
    id: 'newsletter-signup',
    title: 'Newsletter Signup',
    description: 'A beautiful newsletter subscription form with gradient styling. Great for building your email list.',
    category: 'Marketing',
    code: `<form action="https://forgedforms.com/api/forms/{form-id}/submit" method="POST" class="max-w-md mx-auto">
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
</form>`
  }
]; 