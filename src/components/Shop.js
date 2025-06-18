import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPetByCode, buyAccessory } from '../services/petService';
import { accessories } from '../data/accessories';
import notificationService from '../services/notificationService';

const Shop = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Shop categories
  const categories = [
    { id: 'all', name: 'All', emoji: '✨', color: 'from-pink-400 to-purple-400' },
    { id: 'hats', name: 'Hats', emoji: '👒', color: 'from-yellow-400 to-orange-400' },
    { id: 'toys', name: 'Toys', emoji: '🧸', color: 'from-blue-400 to-cyan-400' },
    { id: 'clothes', name: 'Clothes', emoji: '👗', color: 'from-green-400 to-teal-400' },
    { id: 'accessories', name: 'Accessories', emoji: '💎', color: 'from-purple-400 to-pink-400' }
  ];

  useEffect(() => {
    if (!currentUser?.petCode) {
      navigate('/dashboard');
      return;
    }
    loadPet();
  }, [currentUser?.petCode, navigate]);

  const loadPet = async () => {
    try {
      const result = await getPetByCode(currentUser.petCode);
      if (result.success) {
        setPet(result.pet);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to load pet');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (accessory) => {
    if (!pet || purchaseLoading) return;
    setPurchaseLoading(true);
    setPurchaseSuccess(null);

    try {
      const result = await buyAccessory(pet.petCode, accessory);
      
      if (result.success) {
        setPurchaseSuccess(accessory.name);
        setTimeout(() => setPurchaseSuccess(null), 3000);
        
        // Show notification for successful purchase
        if (notificationService.isEnabled()) {
          notificationService.notifyPurchaseSuccess(accessory.name);
        }
        
        await loadPet();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to purchase accessory');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const isAccessoryOwned = (accessoryId) => {
    return pet?.accessories?.some(acc => acc.id === accessoryId);
  };

  const canAfford = (price) => {
    return pet?.coins >= price;
  };

  const filteredAccessories = selectedCategory === 'all' 
    ? accessories 
    : accessories.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🛍️</div>
          <div className="text-2xl text-gray-500">Loading shop...</div>
        </div>
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
            onClick={() => navigate('/pet')}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            Go to Pet
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

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Sparkles */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl shadow-xl p-6 mb-6 border-2 border-pink-200 relative overflow-hidden">
          <div className="absolute top-2 right-2 text-2xl animate-pulse">✨</div>
          <div className="absolute bottom-2 left-2 text-xl animate-bounce">💖</div>
          <div className="text-center relative z-10">
            <h1 className="text-4xl font-bold text-pink-600 mb-2">🛍️ ROOPET Shop</h1>
            <p className="text-gray-600 font-medium">{currentUser?.email}</p>
          </div>
        </div>

        {/* Coins Display with Animation */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl shadow-xl p-6 mb-6 border-2 border-yellow-200">
          <div className="flex items-center justify-center">
            <span className="text-4xl mr-3 animate-pulse">🪙</span>
            <span className="text-4xl font-bold text-yellow-800">{pet.coins}</span>
            <span className="text-yellow-600 ml-3 text-xl font-medium">coins available</span>
            <span className="text-2xl ml-3 animate-bounce">✨</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-2xl font-bold transition-all duration-200 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-110`
                  : 'bg-white text-gray-600 hover:bg-pink-50 hover:scale-105 border-2 border-pink-200'
              }`}
            >
              <span className="text-lg mr-2">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Shop Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAccessories.map((accessory) => {
            const owned = isAccessoryOwned(accessory.id);
            const affordable = canAfford(accessory.price);

            return (
              <div
                key={accessory.id}
                className={`bg-white rounded-3xl shadow-xl p-6 transition-all duration-300 hover:scale-105 border-2 ${
                  owned ? 'border-green-300 bg-green-50' : 'border-pink-200'
                } relative overflow-hidden`}
              >
                {/* Sparkle effect for owned items */}
                {owned && (
                  <div className="absolute top-2 right-2 text-xl animate-spin">✨</div>
                )}
                
                <div className="text-center mb-4">
                  <div className="text-7xl mb-3 animate-pulse">{accessory.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{accessory.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{accessory.description}</p>
                  
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-2xl mr-2">🪙</span>
                    <span className="text-2xl font-bold text-yellow-800">{accessory.price}</span>
                  </div>
                </div>

                {owned ? (
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl font-bold animate-pulse">
                      ✨ Owned ✨
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchase(accessory)}
                    disabled={!affordable || purchaseLoading}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-200 ${
                      affordable
                        ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:scale-105 disabled:opacity-50 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {purchaseLoading ? '🛒 Purchasing...' : affordable ? '💖 Buy Now' : '💔 Not Enough Coins'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Purchase Success Animation */}
        {purchaseSuccess && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl text-xl font-bold animate-bounce z-50">
            ✨ {purchaseSuccess} purchased! ✨
          </div>
        )}

        {/* Owned Accessories Collection */}
        {pet.accessories && pet.accessories.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl shadow-xl p-6 border-2 border-pink-200">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-pink-600 mb-2">✨ Your Collection ✨</h3>
              <p className="text-gray-600">All your adorable accessories!</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pet.accessories.map((accessory, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-green-200 rounded-2xl p-4 flex items-center space-x-3 shadow-lg hover:scale-105 transition-transform"
                >
                  <span className="text-3xl animate-pulse">{accessory.emoji}</span>
                  <div>
                    <div className="font-bold text-gray-800">{accessory.name}</div>
                    <div className="text-sm text-gray-600">{accessory.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop; 