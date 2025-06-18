import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPetByCode, feedPet, playWithPet, cleanPet } from '../services/petService';
import { petTypes } from '../data/accessories';
import { petImages } from '../data/petImages';
import notificationService from '../services/notificationService';

const statHearts = (value, label) => {
  // 3 hearts max, each heart = 34
  const full = Math.floor(value / 34);
  const half = value % 34 >= 17 ? 1 : 0;
  const empty = 3 - full - half;
  const hearts = [];
  for (let i = 0; i < full; i++) hearts.push(<span key={label + 'f' + i} className="text-green-400 text-2xl">❤️</span>);
  if (half) hearts.push(<span key={label + 'h'} className="text-yellow-400 text-2xl">💛</span>);
  for (let i = 0; i < empty; i++) hearts.push(<span key={label + 'e' + i} className="text-gray-300 text-2xl">🤍</span>);
  return hearts;
};

const actionEmojis = {
  feed: '🍖',
  play: '🎾',
  clean: '🛁',
  exercise: '🏃‍♂️',
};

const PetPage = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [showActionEmoji, setShowActionEmoji] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastLowStatsNotification, setLastLowStatsNotification] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Mock fitness stat for now
  const getFitness = () => pet ? Math.max(0, 100 - Math.floor((Date.now() / 1000000) % 100)) : 100;

  useEffect(() => {
    if (!currentUser?.petCode) {
      navigate('/dashboard');
      return;
    }
    
    // Initialize notifications
    initializeNotifications();
    loadPet();
    const interval = setInterval(loadPet, 5000);
    return () => clearInterval(interval);
  }, [currentUser?.petCode, navigate]);

  const initializeNotifications = async () => {
    if (!notificationService.isEnabled()) {
      const granted = await notificationService.requestPermission();
      setNotificationsEnabled(granted);
    } else {
      setNotificationsEnabled(true);
    }
  };

  const loadPet = async () => {
    try {
      const result = await getPetByCode(currentUser.petCode);
      if (result.success) {
        setPet(result.pet);
        
        // Check for low stats and show notifications
        checkLowStats(result.pet);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to load pet');
    } finally {
      setLoading(false);
    }
  };

  const checkLowStats = (petData) => {
    if (!notificationsEnabled) return;

    const lowStats = {
      hunger: petData.hunger < 30,
      happiness: petData.happiness < 30,
      cleanliness: petData.cleanliness < 30
    };

    const hasLowStats = lowStats.hunger || lowStats.happiness || lowStats.cleanliness;
    
    // Only notify if we haven't notified in the last 30 minutes
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (hasLowStats && (!lastLowStatsNotification || (now - lastLowStatsNotification) > thirtyMinutes)) {
      notificationService.notifyLowStats(petData.name, lowStats);
      setLastLowStatsNotification(now);
    }
  };

  const handleAction = async (action) => {
    if (!pet || actionLoading) return;
    setActionLoading(true);
    setCoinsEarned(0);
    setShowActionEmoji(null);
    try {
      let result;
      switch (action) {
        case 'feed':
          result = await feedPet(pet.petCode);
          break;
        case 'play':
          result = await playWithPet(pet.petCode);
          break;
        case 'clean':
          result = await cleanPet(pet.petCode);
          break;
        case 'exercise':
          setShowActionEmoji('exercise');
          setCoinsEarned(5);
          setTimeout(() => setShowActionEmoji(null), 1200);
          // Show notification for exercise
          if (notificationsEnabled) {
            notificationService.notifyPetAction(pet.name, 'exercise', 5);
          }
          return;
        default:
          return;
      }
      if (result.success) {
        setCoinsEarned(result.coinsEarned);
        setShowActionEmoji(action);
        setTimeout(() => setShowActionEmoji(null), 1200);
        
        // Show notification for successful action
        if (notificationsEnabled) {
          notificationService.notifyPetAction(pet.name, action, result.coinsEarned);
        }
        
        await loadPet();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  const getPetEmoji = (type) => {
    const petType = petTypes.find(p => p.type === type);
    return petType ? petType.emoji : '🐾';
  };

  const getStatColor = (value) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatBarColor = (value) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-500">Loading your pet...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  if (!pet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-500">No pet found</div>
      </div>
    );
  }

  const petImage = petImages[pet.type] || petImages.dog;
  const hasLowStats = pet.hunger < 30 || pet.happiness < 30 || pet.cleanliness < 30;
  const fitness = getFitness();

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <div>
          <div className="text-2xl font-bold text-gray-800">{pet.name}</div>
          <div className="text-gray-500 capitalize text-sm">{pet.type}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-4 py-2 rounded-xl font-bold shadow hover:scale-105 transition"
          >
            🛍️ Shop
          </button>
        </div>
      </div>
      {/* Pet Image & Action Emoji */}
      <div className="relative flex flex-col items-center mb-4">
        <img src={petImage} alt={pet.type} className="w-48 h-48 object-contain drop-shadow-xl rounded-2xl bg-white" />
        {showActionEmoji && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce">
            <span className="text-6xl">
              {actionEmojis[showActionEmoji]}
            </span>
          </div>
        )}
      </div>
      {/* Stats Hearts */}
      <div className="flex justify-center gap-8 mb-6">
        <div className="flex flex-col items-center">
          <div className="flex gap-1">{statHearts(pet.happiness, 'happy')}</div>
          <div className="text-xs text-gray-500 font-bold mt-1 tracking-widest">HAPPY</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex gap-1">{statHearts(pet.hunger, 'hunger')}</div>
          <div className="text-xs text-gray-500 font-bold mt-1 tracking-widest">HUNGER</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex gap-1">{statHearts(fitness, 'fitness')}</div>
          <div className="text-xs text-gray-500 font-bold mt-1 tracking-widest">FITNESS</div>
        </div>
      </div>
      {/* Level & Coins */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="bg-yellow-100 border border-yellow-300 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          <span className="text-xl font-bold text-yellow-800">{pet.coins}</span>
        </div>
        <div className="bg-purple-100 border border-purple-300 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-bold text-purple-800">Lv. 1</span>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-2xl">
        <button
          onClick={() => handleAction('feed')}
          disabled={actionLoading}
          className="flex flex-col items-center bg-gradient-to-br from-orange-400 to-yellow-300 text-white py-4 rounded-2xl font-bold text-lg shadow hover:scale-105 transition disabled:opacity-50"
        >
          <span className="text-3xl mb-1">🍖</span>
          Feed
        </button>
        <button
          onClick={() => handleAction('play')}
          disabled={actionLoading}
          className="flex flex-col items-center bg-gradient-to-br from-blue-400 to-cyan-300 text-white py-4 rounded-2xl font-bold text-lg shadow hover:scale-105 transition disabled:opacity-50"
        >
          <span className="text-3xl mb-1">🎾</span>
          Play
        </button>
        <button
          onClick={() => handleAction('clean')}
          disabled={actionLoading}
          className="flex flex-col items-center bg-gradient-to-br from-green-400 to-lime-300 text-white py-4 rounded-2xl font-bold text-lg shadow hover:scale-105 transition disabled:opacity-50"
        >
          <span className="text-3xl mb-1">🛁</span>
          Clean
        </button>
        <button
          onClick={() => handleAction('exercise')}
          disabled={actionLoading}
          className="flex flex-col items-center bg-gradient-to-br from-pink-400 to-purple-300 text-white py-4 rounded-2xl font-bold text-lg shadow hover:scale-105 transition disabled:opacity-50"
        >
          <span className="text-3xl mb-1">🏃‍♂️</span>
          Exercise
        </button>
      </div>
      {/* Accessories */}
      {pet.accessories && pet.accessories.length > 0 && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl shadow-xl p-6 mb-8 w-full max-w-2xl border-2 border-pink-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-pink-600 mb-2">✨ Accessories ✨</h3>
            <p className="text-gray-600 text-sm">Your pet's adorable collection!</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pet.accessories.map((accessory, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 flex flex-col items-center space-y-2 shadow-lg hover:scale-105 transition-transform border-2 border-green-200 relative overflow-hidden"
              >
                <div className="absolute top-1 right-1 text-sm animate-spin">✨</div>
                <span className="text-4xl animate-pulse">{accessory.emoji}</span>
                <span className="font-bold text-gray-800 text-center text-sm">{accessory.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Warning Notification */}
      {hasLowStats && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 w-full max-w-2xl text-center">
          <div className="flex items-center justify-center">
            <span className="text-xl mr-2">⚠️</span>
            <span className="font-medium">Your pet needs attention!</span>
          </div>
          <p className="mt-1 text-sm">
            {pet.hunger < 30 && 'Feed your pet! '}
            {pet.happiness < 30 && 'Play with your pet! '}
            {pet.cleanliness < 30 && 'Clean your pet!'}
          </p>
        </div>
      )}
      {/* Coins Earned Animation */}
      {coinsEarned > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg text-xl font-bold animate-bounce">
          +{coinsEarned} coins!
        </div>
      )}
    </div>
  );
};

export default PetPage; 