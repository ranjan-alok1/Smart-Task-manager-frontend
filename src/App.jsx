import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import NotificationCenter from './components/notifications/NotificationCenter';

function App() {
  return (
    <Router>
      <div>
        <Toaster position="top-right" />
        <NotificationCenter />
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
