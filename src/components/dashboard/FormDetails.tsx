'use client';

import { useState } from 'react';
import { Form } from '@/lib/types/database';
import { formatUUID } from '@/utils/formatting';
import FormSetupTab from '@/components/dashboard/tabs/FormSetupTab';
import FormSubmissionsTab from '@/components/dashboard/tabs/FormSubmissionsTab';
import FormAnalyticsTab from '@/components/dashboard/tabs/FormAnalyticsTab';
import FormSettingsTab from '@/components/dashboard/tabs/FormSettingsTab';

interface FormDetailsProps {
  form: Form;
  onFormUpdated: () => void;
  onDeleteForm: (form: Form) => void;
}

type TabType = 'setup' | 'submissions' | 'analytics' | 'settings';

export default function FormDetails({ form, onFormUpdated: _onFormUpdated, onDeleteForm }: FormDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('setup');

  const tabs = [
    { id: 'setup' as TabType, label: 'Setup', icon: '⚙️' },
    { id: 'submissions' as TabType, label: 'Submissions', icon: '📋' },
    { id: 'analytics' as TabType, label: 'Analytics', icon: '📊' },
    { id: 'settings' as TabType, label: 'Settings', icon: '🔧' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'setup':
        return <FormSetupTab form={form} />;
      
      case 'submissions':
        return <FormSubmissionsTab formId={form.id} />;
      
      case 'analytics':
        return <FormAnalyticsTab formId={form.id} isActive={activeTab === 'analytics'} />;
      
      case 'settings':
        return <FormSettingsTab form={form} onDeleteForm={onDeleteForm} onFormUpdated={_onFormUpdated} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-8 py-6 pt-16 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">{form.name}</h1>
            <p className="text-sm text-gray-500 font-light mt-1">ID: {formatUUID(form.id)}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${
              form.is_active ? 'bg-gray-900' : 'bg-gray-300'
            }`} />
            <span className="text-sm font-normal text-gray-500">
              {form.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <div className="px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-normal text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 