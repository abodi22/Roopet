import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Generate unique pet code
const generatePetCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new pet
export const createPet = async (petType, petName, ownerEmail) => {
  try {
    const petCode = generatePetCode();
    
    const petData = {
      petCode,
      name: petName,
      type: petType,
      hunger: 100,
      happiness: 100,
      cleanliness: 100,
      coins: 0,
      accessories: [],
      owners: [ownerEmail],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    const petRef = doc(db, 'pets', petCode);
    await setDoc(petRef, petData);
    
    return { success: true, petCode, petData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get pet by code
export const getPetByCode = async (petCode) => {
  try {
    const petRef = doc(db, 'pets', petCode);
    const petDoc = await getDoc(petRef);
    
    if (!petDoc.exists()) {
      throw new Error('Pet not found');
    }
    
    const petData = petDoc.data();
    
    // Calculate stat decay based on time since last update
    const now = new Date();
    const lastUpdated = new Date(petData.lastUpdated);
    const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60); // Convert to hours
    
    // Decay rate: 1.5 points per hour (max 24 hours of decay)
    const decayHours = Math.min(hoursSinceUpdate, 24);
    const decayAmount = Math.floor(decayHours * 1.5);
    
    // Apply decay to stats
    const decayedPetData = {
      ...petData,
      hunger: Math.max(0, petData.hunger - decayAmount),
      happiness: Math.max(0, petData.happiness - decayAmount),
      cleanliness: Math.max(0, petData.cleanliness - decayAmount)
    };
    
    // Update the pet with decayed stats if there was decay
    if (decayAmount > 0) {
      await updateDoc(petRef, {
        hunger: decayedPetData.hunger,
        happiness: decayedPetData.happiness,
        cleanliness: decayedPetData.cleanliness,
        lastUpdated: now.toISOString()
      });
    }
    
    return { success: true, pet: decayedPetData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Join a pet
export const joinPet = async (petCode, userEmail) => {
  try {
    const petRef = doc(db, 'pets', petCode);
    const petDoc = await getDoc(petRef);
    
    if (!petDoc.exists()) {
      throw new Error('Pet not found');
    }
    
    const petData = petDoc.data();
    
    if (petData.owners.includes(userEmail)) {
      throw new Error('You are already an owner of this pet');
    }
    
    await updateDoc(petRef, {
      owners: arrayUnion(userEmail)
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update pet stats
export const updatePetStats = async (petCode, updates) => {
  try {
    const petRef = doc(db, 'pets', petCode);
    await updateDoc(petRef, {
      ...updates,
      lastUpdated: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Feed pet
export const feedPet = async (petCode) => {
  try {
    const petRef = doc(db, 'pets', petCode);
    const petDoc = await getDoc(petRef);
    
    if (!petDoc.exists()) {
      throw new Error('Pet not found');
    }
    
    const petData = petDoc.data();
    const newHunger = Math.min(100, petData.hunger + 25);
    const coinsEarned = 5;
    
    await updateDoc(petRef, {
      hunger: newHunger,
      coins: petData.coins + coinsEarned,
      lastUpdated: new Date().toISOString()
    });
    
    return { success: true, coinsEarned };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Play with pet
export const playWithPet = async (petCode) => {
  try {
    const petRef = doc(db, 'pets', petCode);
    const petDoc = await getDoc(petRef);
    
    if (!petDoc.exists()) {
      throw new Error('Pet not found');
    }
    
    const petData = petDoc.data();
    const newHappiness = Math.min(100, petData.happiness + 25);
    const coinsEarned = 5;
    
    await updateDoc(petRef, {
      happiness: newHappiness,
      coins: petData.coins + coinsEarned,
      lastUpdated: new Date().toISOString()
    });
    
    return { success: true, coinsEarned };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Clean pet
export const cleanPet = async (petCode) => {
  try {
    const petRef = doc(db, 'pets', petCode);
    const petDoc = await getDoc(petRef);
    
    if (!petDoc.exists()) {
      throw new Error('Pet not found');
    }
    
    const petData = petDoc.data();
    const newCleanliness = Math.min(100, petData.cleanliness + 25);
    const coinsEarned = 5;
    
    await updateDoc(petRef, {
      cleanliness: newCleanliness,
      coins: petData.coins + coinsEarned,
      lastUpdated: new Date().toISOString()
    });
    
    return { success: true, coinsEarned };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Buy accessory
export const buyAccessory = async (petCode, accessory) => {
  try {
    const petRef = doc(db, 'pets', petCode);
    const petDoc = await getDoc(petRef);
    
    if (!petDoc.exists()) {
      throw new Error('Pet not found');
    }
    
    const petData = petDoc.data();
    
    if (petData.coins < accessory.price) {
      throw new Error('Not enough coins');
    }
    
    await updateDoc(petRef, {
      coins: petData.coins - accessory.price,
      accessories: arrayUnion(accessory),
      lastUpdated: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 