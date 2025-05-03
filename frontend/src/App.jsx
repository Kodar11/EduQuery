import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './components/StartPage';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import HistoryDashboard from './components/HistoryDashboard';
import ProtectedRoute from './components/ProtectedRouter';
import IntroPage from './components/IntroPage'
import EduQueryTour from './components/EduQueryTour';

function App() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/demo" element={<EduQueryTour/>} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/videos' element={<ProtectedRoute element={<Home />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/history" element={<ProtectedRoute element={<HistoryDashboard />} />} />
        <Route path="*" element={<ProtectedRoute element={<Navigate to="/" />} />} />
      </Routes>
    </Router>
  );
}

export default App;