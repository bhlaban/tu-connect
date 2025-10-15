import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ExperienceList from './components/ExperienceList';
import ExperienceForm from './components/ExperienceForm';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/experiences"
            element={
              <ProtectedRoute>
                <ExperienceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/experiences/new"
            element={
              <ProtectedRoute>
                <ExperienceForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/experiences/edit/:id"
            element={
              <ProtectedRoute>
                <ExperienceForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
