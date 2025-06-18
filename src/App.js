import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PetPage from './components/PetPage';
import Shop from './components/Shop';
import Onboarding from './components/Onboarding';
import AdoptPet from './components/AdoptPet';
import JoinGroup from './components/JoinGroup';
import './App.css';

function AuthRedirect() {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to="/onboarding" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

function App() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
            <Route path="/adopt" element={<PrivateRoute><AdoptPet /></PrivateRoute>} />
            <Route path="/join" element={<PrivateRoute><JoinGroup /></PrivateRoute>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/pet" element={<PrivateRoute><Layout><PetPage /></Layout></PrivateRoute>} />
            <Route path="/shop" element={<PrivateRoute><Layout><Shop /></Layout></PrivateRoute>} />
            <Route path="/" element={<AuthRedirect />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 