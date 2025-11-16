import type { GameMode, PlayerRole } from '@/types/user.types';
import type { Card, PlayedCard } from './card.types';

export type GameStatus = 'waiting' | 'starting' | 'active' | 'paused' | 'ended';
export type TurnDirection = 'clockwise' | 'counterclockwise';
 
export interface GameState {
  roomId: string;
  mode: GameMode;
  status: GameStatus;
  currentTurn: string;
  direction: TurnDirection;
  market: Card[];
  playedCards: PlayedCard[];
  lastPlayedCard: PlayedCard | null;
  turnTimer: number;
  gameTimer: number;
  startTime: number | null;
  endTime: number | null;
  winner: string | null;
}

export interface Player {
  id: string;
  username: string;
  avatar: string;
  role: PlayerRole;
  hand: Card[];
  cardCount: number;
  position: number;
  isDisconnected: boolean;
  isLastCard: boolean;
  disconnectedAt: number | null;
  videoStream: MediaStream | null;
  audioMuted: boolean;
  videoDisabled: boolean;
  isReady: boolean;
}

export interface Observer {
  id: string;
  username: string;
  avatar: string;
  handRaised: boolean;
  isUnmuted: boolean;
  videoStream: MediaStream | null;
  joinedAt: number;
}

export interface GameResults {
  roomId: string;
  winner: Player;
  rankings: {
    playerId: string;
    username: string;
    position: number;
    cardsRemaining: number;
  }[];
  payouts: {
    celebrity: number;
    platform: number;
    winners: { playerId: string; amount: number }[];
    luckyObservers: { userId: string; amount: number }[];
  };
  duration: number;
  endedAt: number;
}