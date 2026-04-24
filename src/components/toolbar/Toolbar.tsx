import React, { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';

const Toolbar: React.FC = () => {
  const { saveProject, loadProject, clearCanvas, canvas, exportReactCode } = useBuilderStore();
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('');

  const handleExport = () => {
    const generated = exportReactCode();
    setCode(generated);
    setShowCode(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!');
    });
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'App.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3 z-10 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-4">
          <span className="text-xl">🏗️</span>
          <span className="font-bold text-gray-800 text-base">FE Builder</span>
        </div>

        <div className="flex-1" />

        {/* Component count */}
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
          {canvas.length} component{canvas.length !== 1 ? 's' : ''}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadProject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Load project from JSON file"
          >
            📂 Load
          </button>

          <button
            onClick={saveProject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Save project as JSON"
            disabled={canvas.length === 0}
          >
            💾 Save
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 transition-colors"
            title="Export as React code"
            disabled={canvas.length === 0}
          >
            ⚡ Export React
          </button>

          <button
            onClick={() => {
              if (canvas.length === 0) return;
              if (window.confirm('Clear the entire canvas? This cannot be undone.')) {
                clearCanvas();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
            title="Clear canvas"
            disabled={canvas.length === 0}
          >
            🗑️ Clear
          </button>
        </div>
      </header>

      {/* Code Export Modal */}
      {showCode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCode(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-[720px] max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800 text-lg">⚡ Exported React Code</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  📋 Copy
                </button>
                <button
                  onClick={handleDownloadCode}
                  className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  ⬇️ Download
                </button>
                <button
                  onClick={() => setShowCode(false)}
                  className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  ✕ Close
                </button>
              </div>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-sm font-mono bg-gray-900 text-green-400 rounded-b-xl">
              {code}
            </pre>
          </div>
        </div>
      )}
    </>
  );
};

export default Toolbar;
