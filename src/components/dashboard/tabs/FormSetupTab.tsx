import { useState } from 'react';
import { Form } from '@/lib/types/database';
import { copyToClipboard as copyText } from '@/utils/formatting';
import CodeExample from '@/components/dashboard/CodeExample';

interface FormSetupTabProps {
  form: Form;
}

export default function FormSetupTab({ form }: FormSetupTabProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const endpointUrl = `${window.location.origin}/api/forms/${form.id}`;

  const copyToClipboard = async (text: string, type: string) => {
    const success = await copyText(text);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
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


    </div>
  );
} 