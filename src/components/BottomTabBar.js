import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'pet',
      label: 'Pet',
      icon: '🐾',
      path: '/pet',
      activeIcon: '🐾'
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: '🛍️',
      path: '/shop',
      activeIcon: '🛍️'
    },
    {
      id: 'dashboard',
      label: 'Home',
      icon: '🏠',
      path: '/dashboard',
      activeIcon: '🏠'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-pink-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-200 ${
              isActive(tab.path)
                ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-lg scale-110'
                : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'
            }`}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className={`text-xs font-bold tracking-wider ${
              isActive(tab.path) ? 'text-white' : 'text-gray-600'
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomTabBar; 