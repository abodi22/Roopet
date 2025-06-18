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

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      const result = await signUp(email, password);
      
      if (result.success) {
        navigate('/onboarding');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to create an account');
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create your account</h1>
          <p className="text-gray-500">Sign up to start your pet adventure</p>
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
          <div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent text-lg"
              placeholder="Confirm Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-500 hover:text-pink-600 font-bold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 