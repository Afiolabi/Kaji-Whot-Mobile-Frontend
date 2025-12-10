import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Observer {
  id: string;
  username: string;
  avatar: string;
  handRaised: boolean;
  isUnmuted: boolean;
  videoStream: any; // MediaStream type
}

export interface LobbySettings {
  maxPlayers: number;
  entryFee: number;
  duration: number; // in minutes
  isPrivate: boolean;
  tier?: string; // For rank mode: 'amateur', 'master', 'lord'
}

export interface LobbyPlayer {
  id: string;
  username: string;
  avatar: string;
  isReady: boolean;
  isHost: boolean;
}

export interface LobbyState {
  roomId: string | null;
  host: string | null;
  players: LobbyPlayer[];
  observers: Observer[];
  settings: LobbySettings | null;
  countdown: number | null; // seconds to start
  isInLobby: boolean;
  canStart: boolean;
}

const initialState: LobbyState = {
  roomId: null,
  host: null,
  players: [],
  observers: [],
  settings: null,
  countdown: null,
  isInLobby: false,
  canStart: false,
};

const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    createLobby: (
      state,
      action: PayloadAction<{ roomId: string; host: string; settings: LobbySettings }>
    ) => {
      state.roomId = action.payload.roomId;
      state.host = action.payload.host;
      state.settings = action.payload.settings;
      state.isInLobby = true;
    },
    joinLobby: (
      state,
      action: PayloadAction<{
        roomId: string;
        players: LobbyPlayer[];
        observers: Observer[];
        settings: LobbySettings;
        host: string;
      }>
    ) => {
      state.roomId = action.payload.roomId;
      state.players = action.payload.players;
      state.observers = action.payload.observers;
      state.settings = action.payload.settings;
      state.host = action.payload.host;
      state.isInLobby = true;
    },
    leaveLobby: () => initialState,
    addPlayer: (state, action: PayloadAction<LobbyPlayer>) => {
      state.players.push(action.payload);
      state.canStart = state.players.length >= 2 && state.players.every((p) => p.isReady);
    },
    removePlayer: (state, action: PayloadAction<string>) => {
      state.players = state.players.filter((p) => p.id !== action.payload);
      state.canStart = state.players.length >= 2 && state.players.every((p) => p.isReady);
    },
    addObserver: (state, action: PayloadAction<Observer>) => {
      state.observers.push(action.payload);
    },
    removeObserver: (state, action: PayloadAction<string>) => {
      state.observers = state.observers.filter((o) => o.id !== action.payload);
    },
    updateObserver: (state, action: PayloadAction<{ id: string; updates: Partial<Observer> }>) => {
      const observer = state.observers.find((o) => o.id === action.payload.id);
      if (observer) {
        Object.assign(observer, action.payload.updates);
      }
    },
    togglePlayerReady: (state, action: PayloadAction<string>) => {
      const player = state.players.find((p) => p.id === action.payload);
      if (player) {
        player.isReady = !player.isReady;
      }
      state.canStart = state.players.length >= 2 && state.players.every((p) => p.isReady);
    },
    swapRole: (
      state,
      action: PayloadAction<{
        userId: string;
        fromRole: 'player' | 'observer';
        toRole: 'player' | 'observer';
      }>
    ) => {
      const { userId, fromRole, toRole } = action.payload;

      if (fromRole === 'player' && toRole === 'observer') {
        const player = state.players.find((p) => p.id === userId);
        if (player) {
          state.players = state.players.filter((p) => p.id !== userId);
          state.observers.push({
            id: player.id,
            username: player.username,
            avatar: player.avatar,
            handRaised: false,
            isUnmuted: false,
            videoStream: null,
          });
        }
      } else if (fromRole === 'observer' && toRole === 'player') {
        const observer = state.observers.find((o) => o.id === userId);
        if (observer && state.players.length < (state.settings?.maxPlayers || 4)) {
          state.observers = state.observers.filter((o) => o.id !== userId);
          state.players.push({
            id: observer.id,
            username: observer.username,
            avatar: observer.avatar,
            isReady: false,
            isHost: false,
          });
        }
      }

      state.canStart = state.players.length >= 2 && state.players.every((p) => p.isReady);
    },
    setCountdown: (state, action: PayloadAction<number | null>) => {
      state.countdown = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<LobbySettings>>) => {
      if (state.settings) {
        state.settings = { ...state.settings, ...action.payload };
      }
    },
  },
});

export const {
  createLobby,
  joinLobby,
  leaveLobby,
  addPlayer,
  removePlayer,
  addObserver,
  removeObserver,
  updateObserver,
  togglePlayerReady,
  swapRole,
  setCountdown,
  updateSettings,
} = lobbySlice.actions;

export default lobbySlice.reducer;
