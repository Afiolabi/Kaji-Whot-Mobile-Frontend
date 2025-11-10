# Kaji Whot Mobile - Project Structure

```
kaji-whot-mobile/
├── app/                                # Expo Router file-based routing
│   ├── _layout.tsx                     # Root layout with providers
│   ├── index.tsx                       # Entry point / redirect logic
│   │
│   ├── (auth)/                         # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── splash.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── verify-email.tsx
│   │   └── reset-password.tsx
│   │
│   ├── (tabs)/                         # Main app tabs
│   │   ├── _layout.tsx                 # Tab navigation
│   │   ├── landing.tsx                 # Landing page
│   │   ├── play/                       # Play screens
│   │   │   ├── index.tsx               # Mode selection
│   │   │   ├── offline.tsx             # Bot game setup
│   │   │   ├── free.tsx                # Free room browser
│   │   │   ├── rank.tsx                # Rank room tiers
│   │   │   └── celebrity.tsx           # Celebrity room browser
│   │   ├── wallet/                     # Wallet screens
│   │   │   ├── index.tsx
│   │   │   ├── fund.tsx
│   │   │   ├── withdraw.tsx
│   │   │   └── transactions.tsx
│   │   ├── tasks.tsx                   # Tasks/Rewards screen
│   │   ├── profile/                    # Profile screens
│   │   │   ├── index.tsx
│   │   │   └── verify-celebrity.tsx
│   │   └── settings/                   # Settings screens
│   │       ├── index.tsx
│   │       └── support.tsx
│   │
│   └── (game)/                         # Game screens (fullscreen modal)
│       ├── lobby/[roomId].tsx          # Pre-game lobby
│       └── room/[roomId].tsx           # Active game room
│
├── src/
│   ├── components/                     # Reusable components
│   │   ├── common/                     # Common UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Modal.tsx
│   │   ├── game/                       # Game-specific components
│   │   │   ├── PlayerFrame.tsx
│   │   │   ├── PlayingArea.tsx
│   │   │   ├── CardDeck.tsx
│   │   │   ├── GameCard.tsx
│   │   │   ├── Market.tsx
│   │   │   ├── TurnIndicator.tsx
│   │   │   └── ObserversPanel.tsx
│   │   ├── video/                      # Video/Audio components
│   │   │   ├── VideoStream.tsx
│   │   │   └── VideoControls.tsx
│   │   └── wallet/                     # Wallet components
│   │       ├── BalanceCard.tsx
│   │       └── TransactionItem.tsx
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   ├── useWebRTC.ts
│   │   ├── useGame.ts
│   │   ├── useLobby.ts
│   │   └── useWallet.ts
│   │
│   ├── store/                          # Redux store
│   │   ├── index.ts                    # Store configuration
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── userSlice.ts
│   │       ├── gameSlice.ts
│   │       ├── lobbySlice.ts
│   │       ├── webrtcSlice.ts
│   │       ├── uiSlice.ts
│   │       └── walletSlice.ts
│   │
│   ├── services/                       # External services
│   │   ├── api.service.ts              # REST API client
│   │   ├── socket.service.ts           # Socket.IO client
│   │   └── daily.service.ts            # Daily.co WebRTC
│   │
│   ├── utils/                          # Utility functions
│   │   ├── gameLogic.ts                # Whot game rules
│   │   ├── validation.ts               # Form validation helpers
│   │   ├── formatters.ts               # Data formatters
│   │   └── helpers.ts                  # General helpers
│   │
│   ├── types/                          # TypeScript types
│   │   ├── game.types.ts
│   │   ├── user.types.ts
│   │   ├── wallet.types.ts
│   │   └── api.types.ts
│   │
│   ├── constants/                      # App constants
│   │   └── index.ts
│   │
│   └── config/                         # App configuration
│       └── queryClient.ts              # React Query config
│
├── assets/                             # Static assets
│   ├── images/
│   │   ├── cards/                      # Card images
│   │   ├── icons/                      # App icons
│   │   └── backgrounds/
│   ├── sounds/                         # Game sounds
│   └── fonts/                          # Custom fonts (if any)
│
├── global.css                          # Global Tailwind styles
├── tailwind.config.js                  # Tailwind configuration
├── metro.config.js                     # Metro bundler config
├── babel.config.js                     # Babel configuration
├── tsconfig.json                       # TypeScript config
├── app.json                            # Expo configuration
├── package.json                        # Dependencies
├── .env.example                        # Environment variables template
└── README.md                           # Project documentation
```

## Key Architecture Decisions

### 1. **Expo Router (File-based routing)**
- Clean, intuitive navigation structure
- Automatic deep linking
- Type-safe routing with TypeScript

### 2. **Redux Toolkit (Global State)**
- Game state management
- Lobby state
- User authentication
- Wallet balances
- WebRTC connection state

### 3. **React Query (Server State)**
- API data fetching and caching
- Optimistic updates
- Background refetching
- Error handling

### 4. **NativeWind (Styling)**
- Tailwind CSS utilities for React Native
- Consistent design system
- Fast development

### 5. **Socket.IO (Real-time)**
- Game events
- Lobby updates
- Player actions
- Live notifications

### 6. **Daily.co (Video/Audio)**
- WebRTC video streaming
- Audio communication
- Screen sharing (for celebrities)

## State Management Strategy

### Redux (Application State)
- Auth tokens and user session
- Current game state (cards, turns, etc.)
- Lobby participants
- WebRTC connection status
- UI modals and notifications

### React Query (Server State)
- User profile data
- Room lists
- Transaction history
- Leaderboards
- Friend lists

### Local Component State
- Form inputs
- UI animations
- Temporary selections

## Environment Variables

Create a `.env` file with:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
EXPO_PUBLIC_DAILY_API_KEY=your_daily_api_key
```

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start development server**: `npm start`
3. **Build individual screens** by uploading wireframes
4. **Implement game logic** in utils/gameLogic.ts
5. **Connect to backend API**
6. **Test WebRTC integration**
7. **Add payment gateway**

## Screen Implementation Order (Recommended)

1. ✅ Auth Flow (Splash → Login → Signup)
2. ✅ Landing Page
3. ✅ Play Mode Selection
4. ✅ Free Room Browser
5. ✅ Lobby
6. ✅ Game Room (Core gameplay)
7. ✅ Wallet (Fund, Withdraw, Transactions)
8. ✅ Profile & Settings
9. ✅ Celebrity Verification
10. ✅ Rank Rooms
11. ✅ Celebrity Rooms

Each screen will be built as you upload the corresponding wireframe!