import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  // Load initial state from localStorage or defaults
  // apiKeys is now an array of strings
  const [apiKeys, setApiKeys] = useState(() => {
    const saved = localStorage.getItem('apiKeys');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Migration: If it was a single string, convert to array
        const oldKey = localStorage.getItem('apiKey');
        return oldKey ? [oldKey] : [];
      }
    }
    return [];
  });
  
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  
  const [prompts, setPrompts] = useState(() => {
    const saved = localStorage.getItem('prompts');
    return saved ? JSON.parse(saved) : {
      free: "Provide a concise summary of the topic: {topic}. Keep it simple for a class {class} student.",
      premium: "Provide a detailed, in-depth explanation of the topic: {topic}. Include examples and advanced concepts for a class {class} student.",
      mcq: "Generate 5 multiple choice questions for the topic: {topic} for class {class}. Format as JSON."
    };
  });

  const [specialSyllabus, setSpecialSyllabus] = useState(() => {
    const saved = localStorage.getItem('specialSyllabus');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    localStorage.setItem('specialSyllabus', JSON.stringify(specialSyllabus));
  }, [specialSyllabus]);

  // Actions
  const updateApiKeys = (keysInput) => {
    // Split by newlines or commas and filter empty strings
    const keys = keysInput.split(/[\n,]+/).map(k => k.trim()).filter(k => k.length > 0);
    setApiKeys(keys);
    setCurrentKeyIndex(0); // Reset to first key on update
  };

  const getNextKey = () => {
    if (apiKeys.length === 0) return null;
    return apiKeys[currentKeyIndex];
  };

  const rotateKey = () => {
    if (apiKeys.length <= 1) return false; // No rotation possible
    setCurrentKeyIndex(prev => (prev + 1) % apiKeys.length);
    return true; // Rotation successful
  };
  
  const updatePrompts = (newPrompts) => setPrompts(prev => ({ ...prev, ...newPrompts }));

  const addSpecialSubject = (subjectName) => {
    setSpecialSyllabus(prev => [...prev, { id: Date.now(), name: subjectName, topics: [] }]);
  };

  const addSpecialTopic = (subjectId, topicName) => {
    setSpecialSyllabus(prev => prev.map(sub => 
      sub.id === subjectId 
        ? { ...sub, topics: [...sub.topics, { id: Date.now(), name: topicName }] }
        : sub
    ));
  };
  
  const deleteSpecialSubject = (id) => {
      setSpecialSyllabus(prev => prev.filter(s => s.id !== id));
  }

  const value = {
    apiKeys,
    currentKeyIndex,
    prompts,
    specialSyllabus,
    updateApiKeys,
    getNextKey,
    rotateKey,
    updatePrompts,
    addSpecialSubject,
    addSpecialTopic,
    deleteSpecialSubject
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
