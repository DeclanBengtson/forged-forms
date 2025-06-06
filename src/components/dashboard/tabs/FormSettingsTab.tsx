import { Form } from '@/lib/types/database';
import { formatDate } from '@/utils/formatting';

interface FormSettingsTabProps {
  form: Form;
  onDeleteForm: (form: Form) => void;
}

export default function FormSettingsTab({ form, onDeleteForm }: FormSettingsTabProps) {

  return (
    <div className="space-y-6">
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