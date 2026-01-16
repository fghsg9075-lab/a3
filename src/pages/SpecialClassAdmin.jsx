import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import Layout from '../components/Layout';
import { Plus, Trash2, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SpecialClassAdmin = () => {
  const { specialSyllabus, addSpecialSubject, addSpecialTopic, deleteSpecialSubject } = useSettings();
  const navigate = useNavigate();

  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState({}); // Map subjectId -> topicName

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubject.trim()) {
      addSpecialSubject(newSubject);
      setNewSubject('');
    }
  };

  const handleAddTopic = (subjectId) => {
    const topicName = newTopic[subjectId];
    if (topicName && topicName.trim()) {
      addSpecialTopic(subjectId, topicName);
      setNewTopic({ ...newTopic, [subjectId]: '' });
    }
  };

  const handleTopicInputChange = (subjectId, value) => {
    setNewTopic({ ...newTopic, [subjectId]: value });
  };

  return (
    <Layout>
      <div className="mb-6">
         <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline">← Back</button>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Special Syllabus</h1>
        <p className="text-gray-600 mb-8">Add custom subjects and topics for your special competition mode.</p>

        {/* Add Subject Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-indigo-600">Add New Subject</h2>
          <form onSubmit={handleAddSubject} className="flex gap-4">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Enter subject name (e.g., Advanced Coding)"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Subject</span>
            </button>
          </form>
        </div>

        {/* List Subjects & Topics */}
        <div className="space-y-6">
          {specialSyllabus.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No subjects added yet.</p>
          ) : (
            specialSyllabus.map((subject) => (
              <div key={subject.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Book className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-xl font-bold text-gray-800">{subject.name}</h3>
                  </div>
                  <button 
                    onClick={() => deleteSpecialSubject(subject.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    title="Delete Subject"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Topic List */}
                  {subject.topics.length > 0 && (
                    <ul className="mb-6 space-y-2">
                      {subject.topics.map((topic) => (
                        <li key={topic.id} className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
                          <span>{topic.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Add Topic Form */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newTopic[subject.id] || ''}
                      onChange={(e) => handleTopicInputChange(subject.id, e.target.value)}
                      placeholder="Add a new topic..."
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleAddTopic(subject.id)}
                      className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900"
                    >
                      Add Topic
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SpecialClassAdmin;
