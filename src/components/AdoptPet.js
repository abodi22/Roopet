import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petTypes } from '../data/accessories';
import { useAuth } from '../contexts/AuthContext';
import { createPet } from '../services/petService';
import { petImages } from '../data/petImages';

const petColors = {
  dog: ['#F9A825', '#6D4C41', '#D84315', '#212121', '#FFB300'],
  cat: ['#FFCC80', '#FF9800', '#8D6E63', '#212121', '#E0BCA8'],
};

const AdoptPet = () => {
  const [petType, setPetType] = useState('dog');
  const [color, setColor] = useState(petColors.dog[0]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, updateUserPetCode } = useAuth();
  const navigate = useNavigate();

  const handleTypeChange = (type) => {
    setPetType(type);
    setColor(petColors[type][0]);
  };

  const handleAdopt = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a name for your pet.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await createPet(petType, name.trim(), currentUser.email);
    if (result.success) {
      await updateUserPetCode(result.petCode);
      navigate('/pet');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Use 3D image for pet preview
  const petImage = petImages[petType];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="text-4xl font-extrabold tracking-widest text-gray-800 flex items-center mb-2">
          <img src={petImage} alt={petType} className="w-24 h-24 object-contain" />
        </div>
        <div className="text-2xl font-bold text-gray-700 mb-2">Adopt a Pet</div>
      </div>
      <form onSubmit={handleAdopt} className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-6">
        <div className="flex justify-center gap-4 mb-2">
          {petTypes.slice(0,2).map((pet) => (
            <button
              key={pet.type}
              type="button"
              onClick={() => handleTypeChange(pet.type)}
              className={`text-3xl rounded-full p-3 border-2 ${petType === pet.type ? 'border-pink-400 bg-pink-50' : 'border-gray-200 bg-gray-50'} transition`}
            >
              <img src={petImages[pet.type]} alt={pet.type} className="w-8 h-8 object-contain" />
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-2 mb-2">
          {petColors[petType].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-pink-400' : 'border-gray-200'}`}
              style={{ background: c }}
            />
          ))}
        </div>
        <div className="flex flex-col items-center mb-2">
          <img src={petImage} alt={petType} className="w-32 h-32 object-contain" style={{ filter: color !== petColors[petType][0] ? `drop-shadow(0 0 8px ${color})` : '' }} />
        </div>
        <input
          type="text"
          placeholder="Choose a name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-pink-400 text-lg text-center font-semibold mb-2"
        />
        {error && <div className="text-red-500 text-center text-sm mb-2">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? 'Adopting...' : 'ADOPT'}
        </button>
      </form>
    </div>
  );
};

export default AdoptPet; 