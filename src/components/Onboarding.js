import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const Onboarding = () => {
  const navigate = useNavigate();
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    // Show sparkles after a short delay
    const timer = setTimeout(() => setShowSparkles(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-white p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce opacity-20">🌸</div>
        <div className="absolute top-40 right-20 text-3xl animate-pulse opacity-30">✨</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-bounce opacity-25">💖</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-pulse opacity-20">🎀</div>
      </div>

      <div className="flex flex-col items-center mb-12 relative z-10">
        <RoopetLogo />
        {showSparkles && (
          <div className="flex gap-2 mt-4">
            <span className="text-2xl animate-bounce">✨</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>💖</span>
            <span className="text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎀</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm flex flex-col gap-6 relative z-10">
        <button
          onClick={() => navigate('/adopt')}
          className="w-full py-6 rounded-3xl text-xl font-bold text-white bg-gradient-to-r from-pink-400 to-purple-500 shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-pink-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center justify-center">
            <span className="text-2xl mr-3">🐾</span>
            NEW PET
            <span className="text-2xl ml-3">🐾</span>
          </span>
        </button>

        <div className="flex items-center justify-center">
          <div className="bg-white px-6 py-2 rounded-full text-gray-500 font-bold text-lg shadow-lg border-2 border-pink-200">
            ✨ OR ✨
          </div>
        </div>

        <button
          onClick={() => navigate('/join')}
          className="w-full py-6 rounded-3xl text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-500 shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-cyan-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center justify-center">
            <span className="text-2xl mr-3">👥</span>
            JOIN GROUP
            <span className="text-2xl ml-3">👥</span>
          </span>
        </button>
      </div>

      <div className="mt-12 text-center relative z-10">
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-pink-200">
          <p className="text-gray-600 text-lg font-medium mb-2">
            🎉 Welcome to ROOPET! 🎉
          </p>
          <p className="text-gray-500 text-sm">
            Own a virtual pet with your friends and family.
          </p>
        </div>
      </div>

      {/* Bottom floating elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
        <span className="text-2xl animate-pulse opacity-60">🐱</span>
        <span className="text-2xl animate-bounce opacity-60" style={{ animationDelay: '0.3s' }}>🐶</span>
        <span className="text-2xl animate-pulse opacity-60" style={{ animationDelay: '0.6s' }}>🐰</span>
      </div>
    </div>
  );
};

export default Onboarding; 