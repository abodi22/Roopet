import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomTabBar from './BottomTabBar';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Pages that should show the bottom tab bar
  const showTabBar = ['/pet', '/shop', '/dashboard'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-white">
      <div className={showTabBar ? 'pb-20' : ''}>
        {children}
      </div>
      {showTabBar && <BottomTabBar />}
    </div>
  );
};

export default Layout; 