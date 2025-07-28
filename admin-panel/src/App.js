import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './Components/Users/AdminPanel';
import Dashboard from './Components/Users/Dashboard';
import ImageFetcher from './Components/Users/ImageFetcher';
import LoginForm from './Components/Users/LoginForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/image-fetcher" element={<ImageFetcher />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
