export type GameMode = 'free' | 'rank' | 'celebrity' | 'offline';
export type PlayerRole = 'player' | 'observer';
export type UserRank = 'regular' | 'celebrity';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  balance: number;
  rank: UserRank;
  stats: UserStats;
  friends: string[];
  createdAt: string;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  totalEarnings: number;
  currentStreak: number;
  bestStreak: number;
}