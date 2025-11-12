// Game constants
export const GAME_CONSTANTS = {
  MAX_PLAYERS: 4,
  MIN_PLAYERS: 2,
  INITIAL_CARDS: 6,
  TURN_TIMER: 30, // seconds
  DEFAULT_GAME_DURATION: 15, // minutes
  DISCONNECTION_GRACE_PERIOD: 60, // seconds
  REPLACEMENT_TIMEOUT: 120, // seconds
  COUNTDOWN_BEFORE_START: 5, // seconds
};

// Card shapes
export const CARD_SHAPES = {
  CIRCLE: 'circle',
  TRIANGLE: 'triangle',
  CROSS: 'cross',
  SQUARE: 'square',
  STAR: 'star',
} as const;

// Special cards
export const SPECIAL_CARDS = {
  WHOT: 'whot', // 20
  PICK_TWO: 2,
  HOLD_ON: 1,
  GENERAL_MARKET: 14,
  PICK_THREE: 5, // Star 5 in some variations
  SUSPENSION: 8, // Star 8 in some variations
};

// Game modes
export const GAME_MODES = {
  FREE: 'free',
  RANK: 'rank',
  CELEBRITY: 'celebrity',
  OFFLINE: 'offline',
} as const;

// Rank tiers
export const RANK_TIERS = {
  AMATEUR: { name: 'Amateur', fee: 50, icon: '🥉' },
  MASTER: { name: 'Whot Master', fee: 100, icon: '🥈' },
  LORD: { name: 'Whot Lord', fee: 200, icon: '🥇' },
};

// Celebrity room payout structure
export const CELEBRITY_PAYOUTS = {
  CELEBRITY: 0.50, // 50%
  PLATFORM: 0.25, // 25%
  OBSERVERS: 0.20, // 20% (distributed randomly)
  WINNERS: 0.05, // 5%
};

// Payment constants
export const PAYMENT_CONSTANTS = {
  MIN_DEPOSIT: 100,
  MAX_DEPOSIT: 1000000,
  MIN_WITHDRAWAL: 500,
  MAX_WITHDRAWAL: 1000000,
  WITHDRAWAL_FEE: 50,
};

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  GAME_ENTRY: 'game_entry',
  GAME_WIN: 'game_win',
  REFUND: 'refund',
  GIVEAWAY: 'giveaway',
} as const;

// Video/Audio constraints
export const MEDIA_CONSTRAINTS = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    frameRate: { ideal: 24 },
  },
};

// App colors (matching Tailwind config)
export const COLORS = {
  primary: '#FF385C',
  secondary: '#00A699',
  success: '#00A699',
  warning: '#FFB400',
  error: '#C13515',
  info: '#008489',
  text: {
    primary: '#484848',
    secondary: '#6A6A6A',
    light: '#B0B0B0',
  },
  neutral: {
    50: '#F7F7F7',
    100: '#EBEBEB',
    200: '#DDDDDD',
    300: '#B0B0B0',
    400: '#888888',
    500: '#6A6A6A',
    600: '#484848',
    700: '#383838',
    800: '#282828',
    900: '#181818',
  },
};

// Notification durations
export const NOTIFICATION_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
};

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Socket events (for reference)
export const SOCKET_EVENTS = {
  // Lobby
  CREATE_ROOM: 'createRoom',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  PLAYER_READY: 'playerReady',
  PLAYER_UNREADY: 'playerUnready',
  INVITE_FRIEND: 'inviteFriend',
  SWAP_ROLE: 'swapRole',
  KICK_PLAYER: 'kickPlayer',
  REMATCH: 'rematch',
  
  // Game
  PLAY_CARD: 'playCard',
  DRAW_CARD: 'drawCard',
  DECLARE_WHOT: 'declareWhot',
  PICK_TWO: 'pickTwo',
  REQUEST_CARDS: 'requestCards',
  SUSPEND_PLAYER: 'suspendPlayer',
  
  // Observer
  RAISE_HAND: 'raiseHand',
  LOWER_HAND: 'lowerHand',
  OBSERVER_MESSAGE: 'observerMessage',
  
  // Video/Audio
  TOGGLE_AUDIO: 'toggleAudio',
  TOGGLE_VIDEO: 'toggleVideo',
  MUTE_OBSERVER: 'muteObserver',
  UNMUTE_OBSERVER: 'unmuteObserver',
  
  // Listen events
  ROOM_CREATED: 'roomCreated',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_LEFT: 'playerLeft',
  OBSERVER_JOINED: 'observerJoined',
  GAME_START_COUNTDOWN: 'gameStartCountdown',
  GAME_STARTED: 'gameStarted',
  GAME_STATE_UPDATE: 'gameStateUpdate',
  TURN_CHANGED: 'turnChanged',
  CARD_PLAYED: 'cardPlayed',
  CARD_DRAWN: 'cardDrawn',
  PLAYER_DISCONNECTED: 'playerDisconnected',
  PLAYER_RECONNECTED: 'playerReconnected',
  PLAYER_REPLACED: 'playerReplaced',
  GAME_ENDED: 'gameEnded',
  REMATCH_INITIATED: 'rematchInitiated',
  OBSERVER_HAND_RAISED: 'observerHandRaised',
  OBSERVER_UNMUTED: 'observerUnmuted',
  ERROR: 'error',
};