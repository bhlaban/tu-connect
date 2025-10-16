import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TripList from './components/TripList';
import TripForm from './components/TripForm';
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
            path="/trips"
            element={
              <ProtectedRoute>
                <TripList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/new"
            element={
              <ProtectedRoute>
                <TripForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/edit/:id"
            element={
              <ProtectedRoute>
                <TripForm />
              </ProtectedRoute>
            }
          />
          {/* Redirect old experience routes to trips */}
          <Route path="/experiences" element={<Navigate to="/trips" replace />} />
          <Route path="/experiences/new" element={<Navigate to="/trips/new" replace />} />
          <Route path="/experiences/edit/:id" element={<Navigate to="/trips/edit/:id" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
