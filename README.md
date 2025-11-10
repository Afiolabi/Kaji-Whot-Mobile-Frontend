# Kaji-Whot-Mobile-Frontend
Whot card game with audio visual and enhanced game ux, wagering and wallet for deposits and withdrawal

# 🎮 Kaji Whot Mobile

A production-grade mobile Whot card game with real-time multiplayer, video chat, wagering system, and celebrity rooms.

## ✨ Features

- 🎴 **Classic Whot Gameplay** with enhanced UX
- 🎥 **Live Video/Audio** via Daily.co WebRTC
- 💰 **Wallet System** for deposits and withdrawals
- 🎯 **Multiple Game Modes**: Free, Ranked, Celebrity, Offline
- 👥 **Multiplayer** with up to 4 players + observers
- 🏆 **Celebrity Rooms** with revenue sharing
- 👫 **Friend System** with invitations
- 📊 **Real-time Stats** and leaderboards
- 🔄 **Rematch System** without losing audience

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone and install dependencies**

```bash
cd kaji-whot-mobile
npm install
```

2. **Create environment file**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
EXPO_PUBLIC_DAILY_API_KEY=your_daily_api_key_here
```

3. **Start development server**

```bash
npm start
```

4. **Run on device/simulator**

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

## 📦 Tech Stack

### Core
- **React Native** with Expo SDK 51
- **TypeScript** for type safety
- **Expo Router** for file-based navigation

### State Management
- **Redux Toolkit** for app state
- **React Query** for server state
- **Redux Persist** for data persistence

### Styling
- **NativeWind** (Tailwind for React Native)
- Airbnb-inspired design system

### Real-time & Communication
- **Socket.IO Client** for game events
- **Daily.co** for WebRTC video/audio
- Real-time player synchronization

### Forms & Validation
- **React Hook Form** for form management
- **Zod** for schema validation

### Animations & Gestures
- **React Native Reanimated** for smooth animations
- **React Native Gesture Handler** for touch interactions
- **React Native Keyboard Controller** for keyboard handling

### UI Components
- **@gorhom/bottom-sheet** for modals
- Custom Airbnb-inspired component library

## 📁 Project Structure

```
app/                 # Expo Router screens
├── (auth)/         # Authentication flow
├── (tabs)/         # Main app navigation
└── (game)/         # Game screens

src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── store/          # Redux slices
├── services/       # API, Socket, WebRTC services
├── utils/          # Helper functions
├── types/          # TypeScript types
└── constants/      # App constants
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed structure.

## 🎯 Key Features Implementation

### Game Modes

1. **Free Room** - No entry fee, casual play
2. **Rank Room** - Tiered betting (Amateur ₦50, Master ₦100, Lord ₦200)
3. **Celebrity Room** - Host by verified celebrities with revenue split
4. **Offline Mode** - Play against AI bots

### Disconnection Handling

- 60-second grace period for reconnection
- Host can replace disconnected players with observers
- Original player rejoins as observer if replaced

### Rematch System

- Host initiates rematch in same room
- Players/observers can swap roles in lobby
- Entry fees deducted 5 seconds before start

### Celebrity System

- Verification flow with ID and social media
- Admin approval process
- Revenue split: 50% celebrity, 25% platform, 20% observers, 5% winners
- Automatic random giveaways to observers

## 🔧 Configuration

### Tailwind/NativeWind

Colors are configured in `tailwind.config.js` with Airbnb-inspired palette:

- Primary: `#FF385C` (Rausch)
- Secondary: `#00A699` (Teal)
- Neutral grays for text and backgrounds

### Redux Store

The store is configured with persistence for:
- ✅ Auth tokens
- ✅ User profile
- ❌ Game state (ephemeral)
- ❌ WebRTC streams (non-serializable)

### React Query

Default cache times:
- Stale time: 5 minutes
- GC time: 10 minutes
- Auto-retry: 2 attempts

## 🎮 Game Logic

Core Whot rules implemented in `src/utils/gameLogic.ts`:

- Standard Whot card rules
- Special cards: Pick 2, Hold On, General Market, Whot (20)
- Turn management and direction changes
- Win conditions and scoring

## 🔐 Authentication Flow

```
Splash → Login/Signup → Verify Email → Landing Page
```

Tokens are stored securely and auto-refreshed on 401 responses.

## 💰 Wallet Integration

- Deposit via payment gateway (Paystack/Flutterwave)
- Withdrawal to Nigerian bank accounts
- Transaction history tracking
- Real-time balance updates


## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## 📲 Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

## 🤝 Development Workflow

1. **Feature Branch**: Create from `main`
2. **Development**: Build feature with wireframe reference
3. **Testing**: Test on iOS and Android
4. **PR Review**: Submit for code review
5. **Merge**: Merge to `main` after approval

## 📝 Code Style

- **TypeScript** for all files
- **Functional components** with hooks
- **ESLint** for code quality
- **Prettier** for formatting
- **Tailwind classes** for styling

## 🐛 Troubleshooting

### Metro bundler cache issues

```bash
npm start -- --clear
```

### iOS build fails

```bash
cd ios && pod install && cd ..
```

### Android build fails

```bash
cd android && ./gradlew clean && cd ..
```

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Built for production-grade mobile gaming experience.

---
