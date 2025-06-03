import React, { useState } from 'react';

const codeSnippets: Record<string, string> = {
  html: `<!-- modify this form HTML and place wherever you want your form -->\n<form action=\"https://forgedforms.com/form\" method=\"POST\">\n  <label>\n    Your email:\n    <input type=\"email\" name=\"email\">\n  </label>\n  <label>\n    Your message:\n    <textarea name=\"message\"></textarea>\n  </label>\n  <!-- your other form fields go here -->\n  <button type=\"submit\">Send</button>\n</form>`,
  ajax: `// Example AJAX form submission (using fetch)\nconst form = document.querySelector('form');\nform.addEventListener('submit', async (e) => {\n  e.preventDefault();\n  const data = new FormData(form);\n  const response = await fetch(form.action, {\n    method: 'POST',\n    body: data,\n    headers: {\n      'Accept': 'application/json'\n    }\n  });\n  if (response.ok) {\n    alert('Form submitted!');\n  } else {\n    alert('Submission failed.');\n  }\n});`,
  react: `// Example React form (JSX)\nfunction ContactForm() {\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    // handle form submission\n  };\n  return (\n    <form action=\"https://forgedforms.com/form\" method=\"POST\" onSubmit={handleSubmit}>\n      <label>\n        Your email:\n        <input type=\"email\" name=\"email\" />\n      </label>\n      <label>\n        Your message:\n        <textarea name=\"message\" />\n      </label>\n      <button type=\"submit\">Send</button>\n    </form>\n  );\n}`,
 
};

const tabs = [
  { key: 'html', label: 'HTML' },
  { key: 'ajax', label: 'AJAX' },
  { key: 'react', label: 'React' },
];

export default function CodeExample() {
  const [activeTab, setActiveTab] = useState('html');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Code Example
        </h3>
      <div className="bg-slate-900 rounded-lg shadow-lg max-w-3xl mx-auto mt-8 overflow-hidden border border-slate-800">
        <div className="flex space-x-6 px-6 pt-4">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`text-base px-3 py-1 rounded-t-md focus:outline-none transition-colors duration-150 ${
                activeTab === tab.key
                  ? 'bg-slate-800 text-white font-semibold shadow'
                  : 'bg-transparent text-slate-300 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-slate-900 px-6 py-6 min-h-[320px] text-sm font-mono text-slate-100 border-t border-slate-800 whitespace-pre overflow-x-auto">
          {codeSnippets[activeTab]}
        </div>
      </div>
    </div>
  );
} 