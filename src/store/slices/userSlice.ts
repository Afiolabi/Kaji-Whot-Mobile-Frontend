import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRank = 'regular' | 'celebrity';

interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  totalEarnings: number;
  winRate: number;
}

interface Friend {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  balance: number;
  rank: UserRank;
  isCelebrity: boolean;
  stats: UserStats;
  friends: Friend[];
  phoneNumber: string | null;
  createdAt: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.balance = action.payload;
      }
    },
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      if (state.user) {
        state.user.stats = { ...state.user.stats, ...action.payload };
      }
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      if (state.user) {
        state.user.friends.push(action.payload);
      }
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.friends = state.user.friends.filter(f => f.id !== action.payload);
      }
    },
    updateFriendStatus: (state, action: PayloadAction<{ id: string; isOnline: boolean }>) => {
      if (state.user) {
        const friend = state.user.friends.find(f => f.id === action.payload.id);
        if (friend) {
          friend.isOnline = action.payload.isOnline;
        }
      }
    },
    setCelebrityStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isCelebrity = action.payload;
        state.user.rank = action.payload ? 'celebrity' : 'regular';
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setUser,
  updateBalance,
  updateStats,
  addFriend,
  removeFriend,
  updateFriendStatus,
  setCelebrityStatus,
  clearUser,
  setUserLoading,
  setUserError,
} = userSlice.actions;

export default userSlice.reducer;