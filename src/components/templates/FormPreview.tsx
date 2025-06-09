interface FormPreviewProps {
  code: string;
}

const FormPreview = ({ code }: FormPreviewProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Example Form
          </div>
        </div>
        <div 
          dangerouslySetInnerHTML={{ __html: code }}
          className="form-preview"
        />
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This form connects to your ForgedForms endpoint
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormPreview; 