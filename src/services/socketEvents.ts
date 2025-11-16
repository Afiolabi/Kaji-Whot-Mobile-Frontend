export const SOCKET_EVENTS = {
  // Lobby Events
  CREATE_ROOM: 'createRoom',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  PLAYER_READY: 'playerReady',
  PLAYER_UNREADY: 'playerUnready',
  INVITE_FRIEND: 'inviteFriend',
  SWAP_ROLE: 'swapRole',
  KICK_PLAYER: 'kickPlayer',
  REMATCH: 'rematch',
  
  // Game Events
  PLAY_CARD: 'playCard',
  DRAW_CARD: 'drawCard',
  DECLARE_WHOT: 'declareWhot',
  PICK_TWO: 'pickTwo',
  REQUEST_CARDS: 'requestCards',
  SUSPEND_PLAYER: 'suspendPlayer',
  
  // Observer Events
  RAISE_HAND: 'raiseHand',
  LOWER_HAND: 'lowerHand',
  OBSERVER_MESSAGE: 'observerMessage',
  
  // Video/Audio Events
  TOGGLE_AUDIO: 'toggleAudio',
  TOGGLE_VIDEO: 'toggleVideo',
  MUTE_OBSERVER: 'muteObserver',
  UNMUTE_OBSERVER: 'unmuteObserver',
  
  // Listen Events
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
} as const;