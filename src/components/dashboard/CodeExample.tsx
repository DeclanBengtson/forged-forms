import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeSnippets: Record<string, { code: string; language: string }> = {
  html: {
    code: `<!-- modify this form HTML and place wherever you want your form -->
<form action="https://forgedforms.com/form" method="POST">
  <label>
    Your email:
    <input type="email" name="email">
  </label>
  <label>
    Your message:
    <textarea name="message"></textarea>
  </label>
  <!-- your other form fields go here -->
  <button type="submit">Send</button>
</form>`,
    language: 'html'
  },
  ajax: {
    code: `// Example AJAX form submission (using fetch)
const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const response = await fetch(form.action, {
    method: 'POST',
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  });
  if (response.ok) {
    alert('Form submitted!');
  } else {
    alert('Submission failed.');
  }
});`,
    language: 'javascript'
  },
  react: {
    code: `// Example React form (JSX)
function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission
  };
  return (
    <form action="https://forgedforms.com/form" method="POST" onSubmit={handleSubmit}>
      <label>
        Your email:
        <input type="email" name="email" />
      </label>
      <label>
        Your message:
        <textarea name="message" />
      </label>
      <button type="submit">Send</button>
    </form>
  );
}`,
    language: 'jsx'
  }
};

const tabs = [
  { key: 'html', label: 'HTML' },
  { key: 'ajax', label: 'AJAX' },
  { key: 'react', label: 'React' },
];

export default function CodeExample() {
  const [activeTab, setActiveTab] = useState('html');

  return (
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
        <div className="bg-slate-900 border-t border-slate-800">
          <SyntaxHighlighter
            language={codeSnippets[activeTab].language}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: '24px',
              background: 'transparent',
              fontSize: '14px',
              minHeight: '320px'
            }}
            showLineNumbers={false}
          >
            {codeSnippets[activeTab].code}
          </SyntaxHighlighter>
        </div>
      </div>
  );
} 