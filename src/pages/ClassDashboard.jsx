import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { School, Trophy, Star } from 'lucide-react';

const ClassDashboard = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState('cbse'); // 'cbse' or 'bseb'

  const handleModeSelect = (mode) => {
    // Navigate to subject list with query param for board if needed
    navigate(`/class/${classId}/${mode}?board=${board}`);
  };

  return (
    <Layout>
      <div className="mb-6">
        <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline">← Back to Classes</button>
      </div>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Class {classId} Dashboard</h1>
        <p className="text-gray-600">Select your preferred board and study mode</p>
      </div>

      {/* Board Selection */}
      <div className="flex justify-center mb-10">
        <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
          <button
            onClick={() => setBoard('cbse')}
            className={`px-6 py-2 rounded-md transition-colors ${
              board === 'cbse' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            CBSE (English)
          </button>
          <button
            onClick={() => setBoard('bseb')}
            className={`px-6 py-2 rounded-md transition-colors ${
              board === 'bseb' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            BSEB (Hindi)
          </button>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        
        {/* School Mode */}
        <button
          onClick={() => handleModeSelect('school')}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-blue-500 text-left group"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
              <School className="h-8 w-8 text-blue-600 group-hover:text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">School Mode</h2>
          <p className="text-gray-500 text-sm">
            Focus on NCERT/State Board syllabus. Perfect for exams and daily studies.
          </p>
        </button>

        {/* Competition Mode */}
        <button
          onClick={() => handleModeSelect('competition')}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-purple-500 text-left group"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-600 transition-colors">
              <Trophy className="h-8 w-8 text-purple-600 group-hover:text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Competition Mode</h2>
          <p className="text-gray-500 text-sm">
            Advanced concepts and problem solving for competitive exams.
          </p>
        </button>

        {/* Special Class Mode */}
        <button
          onClick={() => handleModeSelect('special')}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-yellow-500 text-left group"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-600 transition-colors">
              <Star className="h-8 w-8 text-yellow-600 group-hover:text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Special Class Competition</h2>
          <p className="text-gray-500 text-sm">
            Custom syllabus designed by you. Add your own subjects and topics.
          </p>
        </button>

      </div>
    </Layout>
  );
};

export default ClassDashboard;
