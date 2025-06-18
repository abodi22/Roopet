import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Pink/white ROOPET logo
const RoopetLogo = () => (
  <div className="flex flex-col items-center mb-2">
    <div className="text-4xl font-extrabold tracking-widest text-pink-500 flex items-center drop-shadow">
      <span className="mr-2">R</span>
      <span className="mr-2">O</span>
      <span className="mr-2">O</span>
      <span className="mr-2">P</span>
      <span className="mr-2">E</span>
      <span className="mr-2">T</span>
      <span className="ml-2 text-3xl">🐱</span>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const result = await login(email, password);
      if (result.success) {
        // Check if user has a petCode
        const user = JSON.parse(localStorage.getItem('roopet_user'));
        if (user && user.petCode) {
          navigate('/pet');
        } else {
          navigate('/onboarding');
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to log in');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-pink-100 p-4">
      <div className="flex flex-col items-center mb-8">
        <RoopetLogo />
      </div>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back!</h1>
          <p className="text-gray-500">Log in to your account</p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent text-lg"
              placeholder="Email"
            />
          </div>
          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent text-lg"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-pink-500 hover:text-pink-600 font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 