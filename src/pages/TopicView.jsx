import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import Layout from '../components/Layout';
import { BookOpen, Star, CheckSquare, Loader2 } from 'lucide-react';

const TopicView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { prompts, getNextKey, rotateKey } = useSettings();
  
  const topic = searchParams.get('topic');
  const subject = searchParams.get('subject');
  const classId = searchParams.get('class');
  const mode = searchParams.get('mode');
  const board = searchParams.get('board');

  const [activeTab, setActiveTab] = useState(null); // 'free', 'premium', 'mcq'
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateContent = async (type) => {
    setActiveTab(type);
    setLoading(true);
    setError('');
    setContent('');

    try {
      // Select prompt template
      let promptTemplate = "";
      if (type === 'free') promptTemplate = prompts.free;
      else if (type === 'premium') promptTemplate = prompts.premium;
      else if (type === 'mcq') promptTemplate = prompts.mcq;

      // Interpolate prompt
      const finalPrompt = promptTemplate
        .replace(/{topic}/g, topic)
        .replace(/{class}/g, classId)
        .replace(/{subject}/g, subject); // Adding subject just in case users use it

      const apiKey = getNextKey();

      if (!apiKey) {
        // Mock Response for Demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (type === 'mcq') {
          setContent(JSON.stringify([
            { q: `What is the main concept of ${topic}?`, options: ["Option A", "Option B", "Option C", "Option D"], answer: "Option A" },
            { q: "Question 2 placeholder?", options: ["A", "B", "C", "D"], answer: "B" }
          ], null, 2));
        } else {
          setContent(`[MOCK CONTENT for ${type.toUpperCase()}]\n\nHere is a generated explanation for "${topic}" in Class ${classId} (${subject}).\n\nPlease add an OpenAI API Key in Settings to get real AI responses.\n\nGenerated with prompt: "${finalPrompt}"`);
        }
      } else {
        // Real API Call with Retry Logic
        let currentKey = apiKey;
        let attempts = 0;
        const maxAttempts = 10; // Prevent infinite loops if many keys are bad

        while (attempts < maxAttempts) {
          try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentKey}`
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: finalPrompt }],
                temperature: 0.7
              })
            });

            if (response.status === 429 || response.status === 401) {
              console.warn(`Key ${currentKey.substring(0, 8)}... failed with ${response.status}. Rotating...`);
              const rotated = rotateKey();
              if (rotated) {
                currentKey = getNextKey();
                attempts++;
                continue; // Retry with new key
              } else {
                 throw new Error(`API Error: ${response.statusText} (No more keys to rotate)`);
              }
            }
            
            if (!response.ok) {
              throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            setContent(data.choices[0].message.content);
            return; // Success, exit function

          } catch (err) {
             // If it's the error we just threw (No more keys), rethrow it
             if (err.message.includes("No more keys")) throw err;
             
             // Network errors usually shouldn't trigger key rotation unless we're sure
             throw err;
          }
        }
        throw new Error("Failed to generate content after trying multiple keys.");
      }

    } catch (err) {
      setError(err.message || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline">← Back to Topics</button>
      </div>

      <div className="mb-8 border-b pb-6">
        <span className="text-sm font-semibold text-indigo-500 tracking-wide uppercase">{subject} • Class {classId} • {board ? board.toUpperCase() : ''}</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{topic}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => generateContent('free')}
          className={`flex items-center justify-center space-x-2 py-4 px-6 rounded-lg border-2 transition-all ${
            activeTab === 'free' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300 text-gray-700 bg-white'
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="font-bold">Free Notes</span>
        </button>

        <button
          onClick={() => generateContent('premium')}
          className={`flex items-center justify-center space-x-2 py-4 px-6 rounded-lg border-2 transition-all ${
            activeTab === 'premium' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300 text-gray-700 bg-white'
          }`}
        >
          <Star className="h-5 w-5" />
          <span className="font-bold">Premium Notes</span>
        </button>

        <button
          onClick={() => generateContent('mcq')}
          className={`flex items-center justify-center space-x-2 py-4 px-6 rounded-lg border-2 transition-all ${
            activeTab === 'mcq' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-300 text-gray-700 bg-white'
          }`}
        >
          <CheckSquare className="h-5 w-5" />
          <span className="font-bold">MCQ Practice</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 min-h-[400px] p-8">
        {!activeTab ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <BookOpen className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg">Select a content type above to start learning</p>
          </div>
        ) : loading ? (
          <div className="h-full flex flex-col items-center justify-center text-indigo-600">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
            <p>Generating content with AI...</p>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-red-500">
            <p className="font-bold mb-2">Error</p>
            <p>{error}</p>
            <p className="text-sm text-gray-500 mt-4">Check your API Keys in settings.</p>
          </div>
        ) : (
          <div className="prose max-w-none">
             {/* Simple rendering for now. In a real app, use Markdown renderer */}
             <h2 className="text-2xl font-bold mb-4 capitalize">{activeTab} Content</h2>
             <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
               {content}
             </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TopicView;
