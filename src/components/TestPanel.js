import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updatePetStats } from '../services/petService';
import notificationService from '../services/notificationService';

const TestPanel = () => {
  const [testMessage, setTestMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const testNotification = async () => {
    setLoading(true);
    try {
      const success = await notificationService.showNotification('🧪 Test Notification', {
        body: 'This is a test notification from ROOPET!',
        requireInteraction: true
      });
      setTestMessage(success ? '✅ Test notification sent!' : '❌ Failed to send notification');
    } catch (error) {
      setTestMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const testLowStats = async () => {
    if (!currentUser?.petCode) {
      setTestMessage('❌ No pet code found');
      return;
    }

    setLoading(true);
    try {
      // Set pet stats to low values to trigger notification
      await updatePetStats(currentUser.petCode, {
        hunger: 20,
        happiness: 15,
        cleanliness: 25
      });
      
      // Trigger low stats notification
      await notificationService.notifyLowStats('Test Pet', {
        hunger: true,
        happiness: true,
        cleanliness: true
      });
      
      setTestMessage('✅ Low stats test completed! Check for notification.');
    } catch (error) {
      setTestMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const testPetAction = async () => {
    setLoading(true);
    try {
      await notificationService.notifyPetAction('Test Pet', 'feed', 5);
      setTestMessage('✅ Pet action notification sent!');
    } catch (error) {
      setTestMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const testPurchase = async () => {
    setLoading(true);
    try {
      await notificationService.notifyPurchaseSuccess('Test Hat');
      setTestMessage('✅ Purchase notification sent!');
    } catch (error) {
      setTestMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const requestPermission = async () => {
    setLoading(true);
    try {
      const granted = await notificationService.requestPermission();
      setTestMessage(granted ? '✅ Notifications enabled!' : '❌ Notifications denied');
    } catch (error) {
      setTestMessage('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  const checkStatus = () => {
    const status = notificationService.getPermissionStatus();
    const enabled = notificationService.isEnabled();
    setTestMessage(`📊 Status: ${status}, Enabled: ${enabled ? 'Yes' : 'No'}`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-2 border-pink-200">
      <h3 className="text-2xl font-bold text-pink-600 mb-4">🧪 Test Panel</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <button
          onClick={requestPermission}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
        >
          🔔 Request Permission
        </button>
        
        <button
          onClick={checkStatus}
          disabled={loading}
          className="bg-gray-500 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
        >
          📊 Check Status
        </button>
        
        <button
          onClick={testNotification}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
        >
          🧪 Test Notification
        </button>
        
        <button
          onClick={testLowStats}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
        >
          ⚠️ Test Low Stats
        </button>
        
        <button
          onClick={testPetAction}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
        >
          🐾 Test Pet Action
        </button>
        
        <button
          onClick={testPurchase}
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
        >
          🛍️ Test Purchase
        </button>
      </div>
      
      {testMessage && (
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-center">
          <p className="font-medium">{testMessage}</p>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Stat Decay:</strong> Stats decrease by 1.5 points per hour (max 24 hours)</p>
        <p><strong>Low Stats Alert:</strong> Triggers when any stat drops below 30%</p>
        <p><strong>Notifications:</strong> Work on all modern browsers including iOS Safari</p>
      </div>
    </div>
  );
};

export default TestPanel; 