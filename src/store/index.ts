import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import slices
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import gameReducer from './slices/gameSlice';
import lobbyReducer from './slices/lobbySlice';
import webrtcReducer from './slices/webrtcSlice';
import uiReducer from './slices/uiSlice';
import walletReducer from './slices/walletSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'user'], // Only persist auth and user
  blacklist: ['game', 'lobby', 'webrtc', 'ui'], // Don't persist game state
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  game: gameReducer,
  lobby: lobbyReducer,
  webrtc: webrtcReducer,
  ui: uiReducer,
  wallet: walletReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore MediaStream objects in webrtc state
        ignoredActionPaths: ['payload.videoStream', 'payload.audioStream'],
        ignoredPaths: ['webrtc.localStream', 'webrtc.remoteStreams'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;