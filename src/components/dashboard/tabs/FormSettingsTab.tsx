import { useState } from 'react';
import { Form } from '@/lib/types/database';
import { formatDate } from '@/utils/formatting';
import { updateForm } from '@/lib/api/client';

interface FormSettingsTabProps {
  form: Form;
  onDeleteForm: (form: Form) => void;
  onFormUpdated: () => void;
}

export default function FormSettingsTab({ form, onDeleteForm, onFormUpdated }: FormSettingsTabProps) {
  const [loading, setLoading] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState(form.notification_email || '');
  const [emailNotifications, setEmailNotifications] = useState(form.email_notifications);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await updateForm(form.id, {
        notification_email: notificationEmail.trim() || null,
        email_notifications: emailNotifications
      });
      onFormUpdated();
      // Show success message (you might want to add a toast notification here)
    } catch (error) {
      console.error('Failed to update form settings:', error);
      // Show error message (you might want to add a toast notification here)
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = 
    notificationEmail !== (form.notification_email || '') ||
    emailNotifications !== form.email_notifications;

  return (
    <div className="space-y-6">
      {/* Form Configuration */}
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Email Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email_notifications"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
            />
            <label htmlFor="email_notifications" className="ml-2 block text-sm text-gray-700">
              Enable email notifications for new submissions
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-1">
              Notification Email
            </label>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="notifications@yoursite.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-white text-gray-900 text-sm font-normal"
              disabled={!emailNotifications}
            />
            <p className="text-xs text-gray-500 font-light mt-1">
              Email address to receive form submission notifications
            </p>
          </div>

          {hasChanges && (
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition-all duration-300 text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Information */}
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Form Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-1">
              Form Name
            </label>
            <input
              type="text"
              value={form.name}
              className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-white text-gray-900 text-sm font-normal"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-1">
              Form ID
            </label>
            <input
              type="text"
              value={form.id}
              className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 text-sm font-mono"
              readOnly
            />
            <p className="mt-1 text-xs text-gray-500">
              Unique identifier used in form URLs (cannot be changed)
            </p>
          </div>
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-1">
              Created
            </label>
            <input
              type="text"
              value={formatDate(form.created_at)}
              className="w-full px-3 py-2 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 text-sm font-normal"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-sm p-6">
        <h3 className="text-lg font-medium text-red-900 mb-2">
          Danger Zone
        </h3>
        <p className="text-sm text-red-700 font-light mb-4">
          Once you delete a form, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => onDeleteForm(form)}
          className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-all duration-300 text-sm font-normal"
        >
          Delete Form
        </button>
      </div>
    </div>
  );
} 