import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { syllabusData } from '../data/syllabus';
import { useSettings } from '../context/SettingsContext';
import { ChevronDown, ChevronRight, PlusCircle, Book } from 'lucide-react';

const SubjectList = () => {
  const { classId, mode } = useParams();
  const [searchParams] = useSearchParams();
  const board = searchParams.get('board') || 'cbse';
  const navigate = useNavigate();
  const { specialSyllabus } = useSettings();

  const [expandedSubject, setExpandedSubject] = useState(null);

  // Determine which data to use
  let subjects = [];
  let title = "";

  if (mode === 'special') {
    title = "Special Class Syllabus";
    subjects = specialSyllabus; // Uses the context data
  } else {
    const boardData = syllabusData[board];
    const classData = boardData ? boardData[classId] : null;
    subjects = classData ? classData.subjects : [];
    title = `${board.toUpperCase()} Class ${classId} - ${mode === 'school' ? 'School' : 'Competition'} Mode`;
  }

  const toggleSubject = (index) => {
    if (expandedSubject === index) {
      setExpandedSubject(null);
    } else {
      setExpandedSubject(index);
    }
  };

  const handleTopicClick = (subjectName, topicName) => {
    // Navigate to content view
    navigate(`/content?topic=${encodeURIComponent(topicName)}&subject=${encodeURIComponent(subjectName)}&class=${classId}&mode=${mode}&board=${board}`);
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <button onClick={() => navigate(`/class/${classId}`)} className="text-indigo-600 hover:underline">← Back to Dashboard</button>
        {mode === 'special' && (
          <Link to="/special-admin" className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            <PlusCircle className="h-4 w-4" />
            <span>Manage Syllabus</span>
          </Link>
        )}
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">Select a subject and topic to start generating content.</p>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {subjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
            <p className="text-gray-500 mb-4">No subjects found for this selection.</p>
            {mode === 'special' && (
              <Link to="/special-admin" className="text-indigo-600 font-medium hover:underline">
                Add subjects to your special syllabus
              </Link>
            )}
          </div>
        ) : (
          subjects.map((subject, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSubject(index)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Book className="h-5 w-5 text-indigo-500" />
                  <span className="font-semibold text-gray-800">{subject.name}</span>
                </div>
                {expandedSubject === index ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {expandedSubject === index && (
                <div className="p-4 bg-white border-t border-gray-100">
                  {(!subject.topics || subject.topics.length === 0) ? (
                    <p className="text-gray-400 italic text-sm ml-8">No topics available.</p>
                  ) : (
                    <ul className="space-y-2 ml-2">
                      {subject.topics.map((topic, tIndex) => {
                        // Handle both string topics (static data) and object topics (special data)
                        const topicName = typeof topic === 'string' ? topic : topic.name;
                        return (
                          <li key={tIndex}>
                            <button
                              onClick={() => handleTopicClick(subject.name, topicName)}
                              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 w-full text-left px-4 py-2 rounded hover:bg-indigo-50 transition-colors"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                              <span>{topicName}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default SubjectList;
