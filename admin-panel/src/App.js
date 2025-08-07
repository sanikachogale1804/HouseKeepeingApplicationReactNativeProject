import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './Components/Users/AdminPanel';
import Dashboard from './Components/Users/Dashboard';
import ImageFetcher from './Components/Users/ImageFetcher';
import LoginForm from './Components/Users/LoginForm';
import ImageCalendar from './Components/Users/ImageCalendar';
import Report from './Components/Users/Report';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/image-fetcher" element={<ImageFetcher />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/imageCalendar" element={<ImageCalendar />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
};

export default App;
