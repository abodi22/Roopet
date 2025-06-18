# 🐾 RooPet - Multiplayer Pet Care Game

A React web app for couples and friends to take care of a shared virtual pet together. Built with Firebase Firestore for real-time multiplayer functionality and designed as a Progressive Web App (PWA).

## ✨ Features

### 🔐 Custom Authentication
- **No Firebase Auth** - Custom user management using Firestore
- Email/password registration and login
- Secure user sessions with localStorage

### 🐾 Pet Management
- **Create Pets** - Choose from 5 pet types (Dog, Cat, Rabbit, Hamster, Bird)
- **Join Pets** - Use unique 6-character pet codes to join existing pets
- **Real-time Updates** - Pet stats sync across all owners in real-time

### 🎮 Pet Care Actions
- **Feed** - Increase hunger and earn coins
- **Play** - Increase happiness and earn coins  
- **Clean** - Increase cleanliness and earn coins
- **Stats Tracking** - Monitor hunger, happiness, and cleanliness (0-100%)

### 🛍️ Shop System
- **Accessories** - 8 different items to purchase
- **Shared Economy** - Coins are shared between all pet owners
- **Collection Display** - View all owned accessories

### 🔔 Notifications
- **Low Stats Warnings** - Alerts when pet stats drop below 30%
- **Placeholder for Push Notifications** - Ready for future implementation

### 📱 Progressive Web App (PWA)
- **Fullscreen Experience** - Launches like a native app
- **Offline Support** - Service worker for caching
- **Installable** - Add to home screen on mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roopet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Get your Firebase config from Project Settings
   - Update `src/firebase/config.js` with your Firebase configuration:

   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── SignUp.js       # User registration
│   ├── Login.js        # User authentication
│   ├── Dashboard.js    # Main dashboard
│   ├── PetPage.js      # Pet care interface
│   ├── Shop.js         # Accessories shop
│   └── PrivateRoute.js # Route protection
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state
├── services/           # Firebase services
│   └── petService.js   # Pet management functions
├── data/               # Static data
│   └── accessories.js  # Shop items and pet types
├── firebase/           # Firebase configuration
│   └── config.js       # Firebase setup
└── App.js              # Main app component
```

## 🎯 How to Play

### 1. **Sign Up/Login**
- Create an account or log in with existing credentials
- No email verification required

### 2. **Create or Join a Pet**
- **Create**: Choose pet type and name, get a unique pet code
- **Join**: Enter your partner's pet code to join their pet

### 3. **Take Care of Your Pet**
- Feed, play, and clean your pet to maintain stats
- Earn coins for each action
- Monitor pet stats in real-time

### 4. **Shop for Accessories**
- Spend earned coins on accessories
- View your collection of owned items

## 🔧 Technical Details

### Database Schema

**Users Collection**
```javascript
{
  email: string,
  password: string,
  petCode: string | null,
  createdAt: timestamp
}
```

**Pets Collection**
```javascript
{
  petCode: string,
  name: string,
  type: string,
  hunger: number (0-100),
  happiness: number (0-100),
  cleanliness: number (0-100),
  coins: number,
  accessories: array,
  owners: array of emails,
  createdAt: timestamp,
  lastUpdated: timestamp
}
```

### Real-time Updates
- Pet stats are updated in real-time using Firestore
- 5-second polling interval for live updates
- All actions immediately sync across all pet owners

### PWA Features
- Service worker for offline functionality
- Manifest.json for app-like experience
- Fullscreen display mode
- Installable on mobile devices

## 🛠️ Customization

### Adding New Pet Types
Edit `src/data/accessories.js`:
```javascript
export const petTypes = [
  // Add new pet types here
  {
    type: 'newpet',
    name: 'New Pet',
    emoji: '🦄',
    description: 'Description here'
  }
];
```

### Adding New Accessories
Edit `src/data/accessories.js`:
```javascript
export const accessories = [
  // Add new accessories here
  {
    id: 9,
    name: 'New Item',
    price: 100,
    description: 'Description here',
    emoji: '🎁'
  }
];
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 🔮 Future Enhancements

- Push notifications for low pet stats
- Pet animations and interactions
- More pet types and accessories
- Pet evolution system
- Achievement system
- Chat functionality between pet owners
- Pet training mini-games

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub. 