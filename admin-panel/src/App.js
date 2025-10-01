import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './Components/Users/AdminPanel';
import Dashboard from './Components/Users/Dashboard';
import ImageFetcher from './Components/Users/ImageFetcher';
import LoginForm from './Components/Users/LoginForm';
import ImageCalendar from './Components/Users/ImageCalendar';
import Report from './Components/Users/Report';
import Supervisor from './Components/Users/Supervisor';


const App = () => {
  return (
    <Router basename="/admin-panel">
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/image-fetcher" element={<ImageFetcher />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/imageCalendar" element={<ImageCalendar />} />
        <Route path="/report" element={<Report />} />
        <Route path="/supervisor" element={<Supervisor />} />
      </Routes>
    </Router>
  );
};

export default App;
