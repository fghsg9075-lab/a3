import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Home, BookOpen } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <BookOpen className="h-6 w-6" />
            <span>EduGenius</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700 ${location.pathname === '/' ? 'bg-indigo-700' : ''}`}
            >
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link 
              to="/settings" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700 ${location.pathname === '/settings' ? 'bg-indigo-700' : ''}`}
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
