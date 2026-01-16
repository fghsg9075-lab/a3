import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';

import Home from './pages/Home';
import Settings from './pages/Settings';
import ClassDashboard from './pages/ClassDashboard';
import SubjectList from './pages/SubjectList';
import SpecialClassAdmin from './pages/SpecialClassAdmin';
import TopicView from './pages/TopicView';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/class/:classId" element={<ClassDashboard />} />
          <Route path="/class/:classId/:mode" element={<SubjectList />} />
          <Route path="/special-admin" element={<SpecialClassAdmin />} />
          <Route path="/content" element={<TopicView />} />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

export default App;
