import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import Layout from '../components/Layout';
import { Save } from 'lucide-react';

const Settings = () => {
  const { apiKeys, prompts, updateApiKeys, updatePrompts } = useSettings();
  
  const [localKeys, setLocalKeys] = useState(apiKeys.join('\n'));
  const [localPrompts, setLocalPrompts] = useState(prompts);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLocalKeys(apiKeys.join('\n'));
    setLocalPrompts(prompts);
  }, [apiKeys, prompts]);

  const handleSave = (e) => {
    e.preventDefault();
    updateApiKeys(localKeys);
    updatePrompts(localPrompts);
    setStatus('Settings saved successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">App Settings</h1>
        
        <form onSubmit={handleSave}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">API Configuration</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Keys</label>
              <textarea
                value={localKeys}
                onChange={(e) => setLocalKeys(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                rows={5}
                placeholder="sk-key1&#10;sk-key2&#10;sk-key3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter multiple API keys (one per line). If one key hits a limit (quota or rate), the app will automatically switch to the next one.
              </p>
              <p className="text-xs text-indigo-600 mt-1 font-medium">
                Current loaded keys: {apiKeys.length}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600 border-b pb-2">AI Prompts Configuration</h2>
            <p className="text-sm text-gray-600 mb-4">
              Use <code className="bg-gray-100 px-1 rounded">{'{topic}'}</code> and <code className="bg-gray-100 px-1 rounded">{'{class}'}</code> as placeholders.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Free Notes Prompt</label>
                <textarea
                  value={localPrompts.free}
                  onChange={(e) => setLocalPrompts({...localPrompts, free: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Premium Notes Prompt</label>
                <textarea
                  value={localPrompts.premium}
                  onChange={(e) => setLocalPrompts({...localPrompts, premium: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MCQ Prompt</label>
                <textarea
                  value={localPrompts.mcq}
                  onChange={(e) => setLocalPrompts({...localPrompts, mcq: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>Save Settings</span>
            </button>
            {status && <span className="text-green-600 font-medium animate-pulse">{status}</span>}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Settings;
