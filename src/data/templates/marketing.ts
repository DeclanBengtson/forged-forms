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
</form>`,
    implementations: {
      react: `import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const formData = new FormData();
    formData.append('email', email);
    formData.append('_subject', 'New Newsletter Subscription');
    formData.append('source', 'website');

    try {
      const response = await fetch('https://forgedforms.com/api/forms/{form-id}/submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: '🎉 Welcome! Check your email for confirmation.'
        });
        setEmail(''); // Clear email
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: '❌ Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
        <p className="mb-6 opacity-90">Get the latest news and updates delivered to your inbox.</p>
        
        <div className="space-y-4">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            placeholder="Enter your email"
          />
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-blue-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
          </button>
          
          {status.message && (
            <div className={\`text-sm text-center p-3 rounded-lg text-white \${
              status.type === 'success' 
                ? 'bg-white bg-opacity-20' 
                : 'bg-red-500 bg-opacity-50'
            }\`}>
              {status.message}
            </div>
          )}
        </div>
        
        <p className="text-xs mt-4 opacity-75">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </form>
  );
};

export default NewsletterSignup;`
    }
  }
]; 