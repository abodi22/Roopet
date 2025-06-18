import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('roopet_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password) => {
    try {
      const userRef = doc(db, 'users', email);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        throw new Error('User already exists');
      }

      const userData = {
        email,
        password,
        petCode: null,
        createdAt: new Date().toISOString()
      };

      await setDoc(userRef, userData);
      
      const newUser = { email, petCode: null };
      setCurrentUser(newUser);
      localStorage.setItem('roopet_user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const userRef = doc(db, 'users', email);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      
      if (userData.password !== password) {
        throw new Error('Invalid password');
      }

      const user = { email, petCode: userData.petCode };
      setCurrentUser(user);
      localStorage.setItem('roopet_user', JSON.stringify(user));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('roopet_user');
  };

  const updateUserPetCode = async (petCode) => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.email);
      await setDoc(userRef, { petCode }, { merge: true });
      
      const updatedUser = { ...currentUser, petCode };
      setCurrentUser(updatedUser);
      localStorage.setItem('roopet_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user pet code:', error);
    }
  };

  const value = {
    currentUser,
    signUp,
    login,
    logout,
    updateUserPetCode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 