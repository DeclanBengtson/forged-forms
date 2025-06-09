import { useState } from 'react';
import Link from 'next/link';
import { Form } from '@/lib/types/database';
import { copyToClipboard as copyText } from '@/utils/formatting';
import CodeExample from '@/components/dashboard/CodeExample';

interface FormSetupTabProps {
  form: Form;
}

export default function FormSetupTab({ form }: FormSetupTabProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const endpointUrl = `${window.location.origin}/api/forms/${form.id}/submit`;

  const copyToClipboard = async (text: string, type: string) => {
    const success = await copyText(text);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Setup Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-sm p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Quick Setup Instructions
            </h2>
            <p className="text-gray-700 text-sm mb-4">
              Follow these simple steps to integrate your form in less than 2 minutes:
            </p>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Copy your form endpoint URL below</li>
              <li>Add it to your form&apos;s <code className="bg-white px-1 py-0.5 rounded text-xs">action</code> attribute</li>
              <li>Set method to <code className="bg-white px-1 py-0.5 rounded text-xs">POST</code></li>
              <li>Deploy and start collecting submissions!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Form Endpoint */}
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          Form Endpoint
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Endpoint URL
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={endpointUrl}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-gray-900 font-mono text-sm"
                />
              </div>
              <button
                onClick={() => copyToClipboard(endpointUrl, 'url')}
                className="px-4 py-3 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-all duration-300 text-sm font-normal"
              >
                {copied === 'url' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Use this URL as your form&apos;s action attribute. Works with any framework or plain HTML.
            </p>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Implementation Examples
        </h3>
        <CodeExample />
      </div>

      {/* Template Library */}
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Ready-to-Use Templates
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Save time with our pre-built form templates. Just copy, paste, and customize.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">📧 Contact Forms</h4>
            <p className="text-xs text-gray-600 mb-3">Professional contact forms with validation</p>
            <Link 
              href="/templates#contact-form" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Template →
            </Link>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">🎯 Lead Generation</h4>
            <p className="text-xs text-gray-600 mb-3">Capture qualified leads with budget info</p>
            <Link 
              href="/templates#lead-generation-form" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Template →
            </Link>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">📰 Newsletter Signup</h4>
            <p className="text-xs text-gray-600 mb-3">Beautiful email subscription forms</p>
            <Link 
              href="/templates#newsletter-signup" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Template →
            </Link>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">🎫 Event Registration</h4>
            <p className="text-xs text-gray-600 mb-3">Complete event signup forms</p>
            <Link 
              href="/templates#event-registration" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Template →
            </Link>
          </div>
        </div>
        
        <Link 
          href="/templates" 
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Browse All Templates
          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {/* Documentation & Resources */}
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Documentation & Resources
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Link 
            href="/documentation" 
            className="block border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  📚
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Complete Documentation</h4>
                <p className="text-xs text-gray-600">Step-by-step integration guides for all frameworks</p>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/documentation#advanced-features" 
            className="block border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  ⚡
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Advanced Features</h4>
                <p className="text-xs text-gray-600">Custom redirects, webhooks, and API integration</p>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/documentation#validation" 
            className="block border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  ✅
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Form Validation</h4>
                <p className="text-xs text-gray-600">Client-side and server-side validation guide</p>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/documentation#troubleshooting" 
            className="block border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  🛠️
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Troubleshooting</h4>
                <p className="text-xs text-gray-600">Common issues and solutions</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Pro Tips
        </h3>
        
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 font-medium">💡</span>
            <p>Use meaningful field names like <code className="bg-white px-1 py-0.5 rounded text-xs">name</code>, <code className="bg-white px-1 py-0.5 rounded text-xs">email</code>, <code className="bg-white px-1 py-0.5 rounded text-xs">message</code> for better organization</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 font-medium">🎯</span>
            <p>Add hidden fields like <code className="bg-white px-1 py-0.5 rounded text-xs">_subject</code> to customize email notification subjects</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 font-medium">🔒</span>
            <p>Forms work with HTTPS and HTTP, but HTTPS is recommended for security</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 font-medium">⚡</span>
            <p>Test your forms in development and production environments before going live</p>
          </div>
        </div>
      </div>


    </div>
  );
} 