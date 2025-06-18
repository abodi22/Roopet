// Notification Service for ROOPET
class NotificationService {
  constructor() {
    this.permission = 'default';
    this.isSupported = 'Notification' in window;
    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.log('Notifications not supported');
      return;
    }

    // Check if permission is already granted
    if (Notification.permission === 'granted') {
      this.permission = 'granted';
    } else if (Notification.permission === 'denied') {
      this.permission = 'denied';
    }
  }

  async requestPermission() {
    if (!this.isSupported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') {
      return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/logo192.png', // PWA icon
        badge: '/logo192.png',
        tag: 'roopet-notification',
        requireInteraction: false,
        silent: false,
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  // Pet-specific notifications
  async notifyLowStats(petName, lowStats) {
    const messages = [];
    if (lowStats.hunger) messages.push('hungry');
    if (lowStats.happiness) messages.push('sad');
    if (lowStats.cleanliness) messages.push('dirty');

    const message = `${petName} is ${messages.join(', ')}! Please take care of your pet! 🐾`;
    
    return this.showNotification('🐱 ROOPET Alert', {
      body: message,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'low-stats',
      requireInteraction: true
    });
  }

  async notifyPetAction(petName, action, coinsEarned) {
    const actionEmojis = {
      feed: '🍖',
      play: '🎾',
      clean: '🛁',
      exercise: '🏃‍♂️'
    };

    const actionNames = {
      feed: 'fed',
      play: 'played with',
      clean: 'cleaned',
      exercise: 'exercised'
    };

    const message = `You ${actionNames[action]} ${petName}! +${coinsEarned} coins earned! ${actionEmojis[action]}`;
    
    return this.showNotification('✨ ROOPET Update', {
      body: message,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'pet-action'
    });
  }

  async notifyPurchaseSuccess(itemName) {
    const message = `Successfully purchased ${itemName}! Your pet will love it! 🎉`;
    
    return this.showNotification('🛍️ ROOPET Shop', {
      body: message,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'purchase-success'
    });
  }

  // Check if notifications are enabled
  isEnabled() {
    return this.isSupported && this.permission === 'granted';
  }

  // Get permission status
  getPermissionStatus() {
    return this.permission;
  }
}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService; 