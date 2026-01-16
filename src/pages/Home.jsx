import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Layout from '../components/Layout';

const Home = () => {
  const classes = [6, 7, 8, 9, 10, 11, 12];

  return (
    <Layout>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to EduGenius</h1>
        <p className="text-xl text-gray-600">Select your class to begin learning with AI</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classes.map((cls) => (
          <Link
            key={cls}
            to={`/class/${cls}`}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 flex flex-col items-center justify-center border border-gray-100 group"
          >
            <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
              <GraduationCap className="h-10 w-10 text-indigo-600 group-hover:text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Class {cls}</h2>
            <p className="text-sm text-gray-500 mt-2">CBSE & BSEB</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
