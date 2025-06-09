'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from '@/components/CopyButton';
import FormPreview from './FormPreview';
import { Template } from '@/types/Template';

interface TemplateCardProps {
  template: Template;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className="mb-12 template-content" id={template.id}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">{template.title}</h3>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-1 rounded-full">
            {template.category}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{template.description}</p>
      </div>
      
      <div className="relative">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
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
          
          {activeTab === 'code' && <CopyButton code={template.code} />}
        </div>

        {/* Content */}
        {activeTab === 'preview' ? (
          <FormPreview code={template.code} />
        ) : (
          <div className="bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-slate-800 template-code-block">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <span className="text-xs font-medium text-slate-300">HTML</span>
            </div>
            <div className="overflow-x-auto syntax-highlighter-container">
              <SyntaxHighlighter
                language="html"
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: '24px',
                  background: 'transparent',
                  fontSize: '14px',
                  minHeight: '200px',
                  minWidth: '100%',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
                showLineNumbers={false}
                wrapLines={true}
                wrapLongLines={true}
              >
                {template.code}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard; 