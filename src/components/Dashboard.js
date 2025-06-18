import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createPet, joinPet } from '../services/petService';
import { petTypes } from '../data/accessories';
import { petImages } from '../data/petImages';
import TestPanel from './TestPanel';

const statHearts = (value, label) => {
  const full = Math.floor(value / 34);
  const half = value % 34 >= 17 ? 1 : 0;
  const empty = 3 - full - half;
  const hearts = [];
  for (let i = 0; i < full; i++) hearts.push(<span key={label + 'f' + i} className="text-pink-400 text-2xl">❤️</span>);
  if (half) hearts.push(<span key={label + 'h'} className="text-pink-200 text-2xl">💗</span>);
  for (let i = 0; i < empty; i++) hearts.push(<span key={label + 'e' + i} className="text-gray-300 text-2xl">🤍</span>);
  return hearts;
};

const Dashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedPetType, setSelectedPetType] = useState('');
  const [petName, setPetName] = useState('');
  const [petCode, setPetCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdPetCode, setCreatedPetCode] = useState('');
  const { currentUser, updateUserPetCode, logout } = useAuth();
  const navigate = useNavigate();

  const handleCreatePet = async (e) => {
    e.preventDefault();
    if (!selectedPetType || !petName.trim()) {
      setError('Please select a pet type and enter a name');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const result = await createPet(selectedPetType, petName.trim(), currentUser.email);
      if (result.success) {
        await updateUserPetCode(result.petCode);
        setCreatedPetCode(result.petCode);
        setShowCreateForm(false);
        setSelectedPetType('');
        setPetName('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to create pet');
    }
    setLoading(false);
  };

  const handleJoinPet = async (e) => {
    e.preventDefault();
    if (!petCode.trim()) {
      setError('Please enter a pet code');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const result = await joinPet(petCode.trim().toUpperCase(), currentUser.email);
      if (result.success) {
        await updateUserPetCode(petCode.trim().toUpperCase());
        navigate('/pet');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to join pet');
    }
    setLoading(false);
  };

  const handleGoToPet = () => {
    navigate('/pet');
  };

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

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <RoopetLogo />
          <button
            onClick={logout}
            className="bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:scale-105 transition"
          >
            Logout
          </button>
        </div>
        {/* Main Content */}
        {currentUser?.petCode && !createdPetCode ? (
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center mb-8 border-2 border-pink-200">
            <div className="mb-4">
              <img
                src={petImages.dog}
                alt="pet"
                className="w-32 h-32 object-contain drop-shadow-xl rounded-2xl bg-pink-50 border-2 border-pink-200"
              />
            </div>
            <div className="text-2xl font-bold text-pink-600 mb-2">Your Pet</div>
            <div className="mb-2 text-lg text-gray-700">
              <span className="font-bold">Code:</span> <span className="bg-pink-100 px-2 py-1 rounded-xl font-mono text-pink-600">{currentUser.petCode}</span>
            </div>
            <div className="flex gap-6 mb-4">
              <div className="flex flex-col items-center">
                <div className="flex gap-1">{statHearts(100, 'happy')}</div>
                <div className="text-xs text-gray-500 font-bold mt-1 tracking-widest">HAPPY</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex gap-1">{statHearts(100, 'hunger')}</div>
                <div className="text-xs text-gray-500 font-bold mt-1 tracking-widest">HUNGER</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex gap-1">{statHearts(100, 'fitness')}</div>
                <div className="text-xs text-gray-500 font-bold mt-1 tracking-widest">FITNESS</div>
              </div>
            </div>
            <button
              onClick={handleGoToPet}
              className="mt-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow hover:scale-105 transition"
            >
              Go to Pet
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Create Pet Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-pink-200 flex flex-col items-center">
              <div className="text-2xl font-bold text-pink-600 mb-4">Adopt a New Pet</div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full py-4 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-pink-400 to-pink-600 shadow-lg hover:scale-105 transition mb-4"
              >
                NEW PET
              </button>
              {showCreateForm && (
                <form onSubmit={handleCreatePet} className="w-full flex flex-col gap-4 mt-4">
                  <select
                    value={selectedPetType}
                    onChange={(e) => setSelectedPetType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent text-lg"
                    required
                  >
                    <option value="">Select a pet type</option>
                    {petTypes.map((pet) => (
                      <option key={pet.type} value={pet.type}>
                        {pet.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 text-lg"
                    placeholder="Enter pet name"
                    required
                  />
                  {error && (
                    <div className="bg-pink-100 border border-pink-400 text-pink-700 px-4 py-3 rounded text-center">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-pink-400 to-pink-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Pet'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setError('');
                        setSelectedPetType('');
                        setPetName('');
                      }}
                      className="px-4 py-3 border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
            {/* Join Pet Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-pink-200 flex flex-col items-center">
              <div className="text-2xl font-bold text-pink-600 mb-4">Join a Pet</div>
              <button
                onClick={() => setShowJoinForm(true)}
                className="w-full py-4 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-pink-400 to-pink-600 shadow-lg hover:scale-105 transition mb-4"
              >
                JOIN GROUP
              </button>
              {showJoinForm && (
                <form onSubmit={handleJoinPet} className="w-full flex flex-col gap-4 mt-4">
                  <input
                    type="text"
                    value={petCode}
                    onChange={(e) => setPetCode(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 text-lg uppercase tracking-widest"
                    placeholder="Enter pet code (e.g., ABC123)"
                    required
                  />
                  {error && (
                    <div className="bg-pink-100 border border-pink-400 text-pink-700 px-4 py-3 rounded text-center">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-pink-400 to-pink-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
                    >
                      {loading ? 'Joining...' : 'Join Pet'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowJoinForm(false);
                        setError('');
                        setPetCode('');
                      }}
                      className="px-4 py-3 border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        {/* Created Pet Code Display */}
        {createdPetCode && (
          <div className="mt-6 bg-pink-100 border border-pink-400 text-pink-700 px-6 py-4 rounded-2xl text-center max-w-lg mx-auto">
            <h3 className="font-bold mb-2 text-lg">🎉 Pet Created Successfully!</h3>
            <p className="mb-3">Share this code with your friend:</p>
            <div className="bg-white p-3 rounded border-2 border-pink-300 inline-block">
              <code className="text-2xl font-mono font-bold text-pink-800">{createdPetCode}</code>
            </div>
            <button
              onClick={handleGoToPet}
              className="mt-3 bg-gradient-to-r from-pink-400 to-pink-600 text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition"
            >
              Go to Pet
            </button>
          </div>
        )}

        {/* Test Panel for Development */}
        {process.env.NODE_ENV === 'development' && (
          <TestPanel />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 