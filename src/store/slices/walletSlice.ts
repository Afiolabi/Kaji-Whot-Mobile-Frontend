import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransactionType = 'deposit' | 'withdrawal' | 'game_entry' | 'game_win' | 'refund' | 'giveaway';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  reference?: string;
  gameId?: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  pendingDeposit: {
    amount: number;
    reference: string;
  } | null;
}

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
  pendingDeposit: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      
      // Update balance based on transaction type and status
      if (action.payload.status === 'completed') {
        if (action.payload.type === 'deposit' || action.payload.type === 'game_win' || action.payload.type === 'refund' || action.payload.type === 'giveaway') {
          state.balance += action.payload.amount;
        } else if (action.payload.type === 'withdrawal' || action.payload.type === 'game_entry') {
          state.balance -= action.payload.amount;
        }
      }
    },
    updateTransaction: (state, action: PayloadAction<{ id: string; updates: Partial<Transaction> }>) => {
      const transaction = state.transactions.find(t => t.id === action.payload.id);
      if (transaction) {
        const oldStatus = transaction.status;
        Object.assign(transaction, action.payload.updates);
        
        // Update balance if status changed to completed
        if (oldStatus !== 'completed' && action.payload.updates.status === 'completed') {
          if (transaction.type === 'deposit' || transaction.type === 'game_win' || transaction.type === 'refund' || transaction.type === 'giveaway') {
            state.balance += transaction.amount;
          } else if (transaction.type === 'withdrawal' || transaction.type === 'game_entry') {
            state.balance -= transaction.amount;
          }
        }
      }
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setPendingDeposit: (state, action: PayloadAction<{ amount: number; reference: string } | null>) => {
      state.pendingDeposit = action.payload;
    },
    clearPendingDeposit: (state) => {
      state.pendingDeposit = null;
    },
    setWalletLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setWalletError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearWalletError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setBalance,
  addTransaction,
  updateTransaction,
  setTransactions,
  setPendingDeposit,
  clearPendingDeposit,
  setWalletLoading,
  setWalletError,
  clearWalletError,
} = walletSlice.actions;

export default walletSlice.reducer;