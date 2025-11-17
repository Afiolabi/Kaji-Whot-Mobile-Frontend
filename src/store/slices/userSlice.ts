import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRank = 'amateur' | 'whot-master' | 'whot-lord' | 'celebrity';

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

type User = {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  balance: number;
  coins: number;
  rank: UserRank;
  isCelebrity: boolean;
  stats: UserStats;
  friends: Friend[];
  phoneNumber: string | null;
  createdAt: string;
}

interface UserState{
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: {
    id: '',
    username: '',
    email: '',
    avatar: '',
    balance: 0,
    coins: 0,
    rank: 'amateur',
    isCelebrity: false,
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      totalEarnings: 0,
      winRate: 0,
    },
    friends: [],
    phoneNumber: '',
    createdAt: '',
  },
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
        state.user.friends = state.user.friends.filter((f) => f.id !== action.payload);
      }
    },
    updateFriendStatus: (state, action: PayloadAction<{ id: string; isOnline: boolean }>) => {
      if (state.user) {
        const friend = state.user.friends.find((f) => f.id === action.payload.id);
        if (friend) {
          friend.isOnline = action.payload.isOnline;
        }
      }
    },
    setCelebrityStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isCelebrity = action.payload;
        state.user.rank = action.payload ? 'celebrity' : 'amateur';
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
