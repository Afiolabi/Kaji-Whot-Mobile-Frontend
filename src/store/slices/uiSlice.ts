import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Card } from './gameSlice';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface Modal {
  show: boolean;
  data?: any;
}

interface UIState {
  currentView: string;
  modals: {
    inspectCards: Modal & { cards: Card[] };
    replacePlayer: Modal & { disconnectedPlayer: string | null };
    insufficientFunds: Modal & { required: number };
    observersPanel: Modal;
    inviteFriends: Modal;
    gameSettings: Modal;
    confirmExit: Modal;
  };
  notifications: Notification[];
  isKeyboardVisible: boolean;
  tabBarVisible: boolean;
}

const initialState: UIState = {
  currentView: 'home',
  modals: {
    inspectCards: { show: false, cards: [] },
    replacePlayer: { show: false, disconnectedPlayer: null },
    insufficientFunds: { show: false, required: 0 },
    observersPanel: { show: false },
    inviteFriends: { show: false },
    gameSettings: { show: false },
    confirmExit: { show: false },
  },
  notifications: [],
  isKeyboardVisible: false,
  tabBarVisible: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
    showModal: (state, action: PayloadAction<{ modal: keyof UIState['modals']; data?: any }>) => {
      const { modal, data } = action.payload;
      state.modals[modal].show = true;
      if (data) {
        state.modals[modal].data = data;
      }
    },
    hideModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload].show = false;
      state.modals[action.payload].data = undefined;
    },
    showInspectCards: (state, action: PayloadAction<Card[]>) => {
      state.modals.inspectCards.show = true;
      state.modals.inspectCards.cards = action.payload;
    },
    showReplacePlayer: (state, action: PayloadAction<string>) => {
      state.modals.replacePlayer.show = true;
      state.modals.replacePlayer.disconnectedPlayer = action.payload;
    },
    showInsufficientFunds: (state, action: PayloadAction<number>) => {
      state.modals.insufficientFunds.show = true;
      state.modals.insufficientFunds.required = action.payload;
    },
    toggleObserversPanel: (state) => {
      state.modals.observersPanel.show = !state.modals.observersPanel.show;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setKeyboardVisible: (state, action: PayloadAction<boolean>) => {
      state.isKeyboardVisible = action.payload;
    },
    setTabBarVisible: (state, action: PayloadAction<boolean>) => {
      state.tabBarVisible = action.payload;
    },
  },
});

export const {
  setCurrentView,
  showModal,
  hideModal,
  showInspectCards,
  showReplacePlayer,
  showInsufficientFunds,
  toggleObserversPanel,
  addNotification,
  removeNotification,
  clearNotifications,
  setKeyboardVisible,
  setTabBarVisible,
} = uiSlice.actions;

export default uiSlice.reducer;