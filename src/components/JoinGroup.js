import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { joinPet } from '../services/petService';

const JoinGroup = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, updateUserPetCode } = useAuth();
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a code.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await joinPet(code.trim().toUpperCase(), currentUser.email);
    if (result.success) {
      await updateUserPetCode(code.trim().toUpperCase());
      navigate('/pet');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="text-4xl font-extrabold tracking-widest text-gray-800 flex items-center mb-2">
          <span className="mr-2">🔑</span>
        </div>
        <div className="text-2xl font-bold text-gray-700 mb-2">Join Group</div>
      </div>
      <form onSubmit={handleJoin} className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-6">
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-cyan-400 text-lg text-center font-semibold mb-2 uppercase tracking-widest"
        />
        {error && <div className="text-red-500 text-center text-sm mb-2">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-green-400 shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? 'Joining...' : 'JOIN GROUP'}
        </button>
      </form>
      <div className="mt-8 text-center text-gray-500 text-lg font-medium">
        Own a pet together with your friends, family, or co-workers.
      </div>
    </div>
  );
};

export default JoinGroup; 