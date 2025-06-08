'use client';

export default function CopyButton({ code }: { code: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      Copy
    </button>
  );
} 