import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GameMode = 'free' | 'rank' | 'celebrity' | 'offline';
export type Direction = 'clockwise' | 'counterclockwise';

export interface Card {
  id: string;
  shape: 'circle' | 'triangle' | 'cross' | 'square' | 'star';
  number: number | 'whot';
  isSpecial?: boolean; // pick2, hold-on, general-market, etc.
}

export interface Player {
  id: string;
  username: string;
  avatar: string;
  hand: Card[]; // Only populated for current user
  cardCount: number;
  isDisconnected: boolean;
  isLastCard: boolean;
  videoStream: any; // MediaStream type
  audioMuted: boolean;
  videoDisabled: boolean;
  position: number; // 0-3 for 4 players
  hasPlayedTurn?: boolean;
  missedTurns?: number;
}

export interface GameState {
  market: Card[];
  playedCards: Card[];
  currentTurn: string; // player id
  direction: Direction;
  turnTimer: number;
  gameTimer: number;
  lastPlayedCard: Card | null;
  activeShape: string | null; // For whot card declarations
}

export interface GameResults {
  winner: string; // userId
  rankings: { userId: string; position: number; earnings: number }[];
  payouts: {
    celebrity: number;
    platform: number;
    winners: number;
    luckyObservers: { userId: string; amount: number }[];
  };
}

interface Game {
  roomId: string | null;
  mode: GameMode | null;
  gameState: GameState | null;
  players: Player[];
  results: GameResults | null;
  isActive: boolean;
  isPaused: boolean;
}

const initialState: Game = {
  roomId: null,
  mode: null,
  gameState: null,
  players: [],
  results: null,
  isActive: false,
  isPaused: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initGame: (state, action: PayloadAction<{ roomId: string; mode: GameMode }>) => {
      state.roomId = action.payload.roomId;
      state.mode = action.payload.mode;
      state.isActive = false;
    },
    startGame: (state, action: PayloadAction<{ gameState: GameState; players: Player[] }>) => {
      state.gameState = action.payload.gameState;
      state.players = action.payload.players;
      state.isActive = true;
      state.isPaused = false;
    },
    updateGameState: (state, action: PayloadAction<Partial<GameState>>) => {
      if (state.gameState) {
        state.gameState = { ...state.gameState, ...action.payload };
      }
    },
    updatePlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    updatePlayer: (state, action: PayloadAction<{ playerId: string; updates: Partial<Player> }>) => {
      const playerIndex = state.players.findIndex(p => p.id === action.payload.playerId);
      if (playerIndex !== -1) {
        state.players[playerIndex] = { ...state.players[playerIndex], ...action.payload.updates };
      }
    },
    playCard: (state, action: PayloadAction<Card>) => {
      if (state.gameState) {
        state.gameState.playedCards.push(action.payload);
        state.gameState.lastPlayedCard = action.payload;
      }
    },
    drawCards: (state, action: PayloadAction<{ playerId: string; count: number; cards?: Card[] }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        if (action.payload.cards) {
          player.hand.push(...action.payload.cards);
        }
        player.cardCount += action.payload.count;
      }
    },
    setCurrentTurn: (state, action: PayloadAction<string>) => {
      if (state.gameState) {
        state.gameState.currentTurn = action.payload;
        state.gameState.turnTimer = 30; // Reset turn timer
      }
    },
    updateTurnTimer: (state, action: PayloadAction<number>) => {
      if (state.gameState) {
        state.gameState.turnTimer = action.payload;
      }
    },
    updateGameTimer: (state, action: PayloadAction<number>) => {
      if (state.gameState) {
        state.gameState.gameTimer = action.payload;
      }
    },
    setDirection: (state, action: PayloadAction<Direction>) => {
      if (state.gameState) {
        state.gameState.direction = action.payload;
      }
    },
    setActiveShape: (state, action: PayloadAction<string>) => {
      if (state.gameState) {
        state.gameState.activeShape = action.payload;
      }
    },
    playerDisconnected: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (player) {
        player.isDisconnected = true;
      }
    },
    playerReconnected: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (player) {
        player.isDisconnected = false;
        player.missedTurns = 0;
      }
    },
    pauseGame: (state) => {
      state.isPaused = true;
    },
    resumeGame: (state) => {
      state.isPaused = false;
    },
    endGame: (state, action: PayloadAction<GameResults>) => {
      state.results = action.payload;
      state.isActive = false;
    },
    resetGame: () => initialState,
  },
});

export const {
  initGame,
  startGame,
  updateGameState,
  updatePlayers,
  updatePlayer,
  playCard,
  drawCards,
  setCurrentTurn,
  updateTurnTimer,
  updateGameTimer,
  setDirection,
  setActiveShape,
  playerDisconnected,
  playerReconnected,
  pauseGame,
  resumeGame,
  endGame,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;