import { io, Socket } from 'socket.io-client';
import { store } from '@store/index';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const state = store.getState();
    const token = state.auth.token;

    if (!token) {
      console.error('Cannot connect to socket without auth token');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Emit methods
  emit(event: string, data?: any) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, cannot emit:', event);
      return;
    }
    this.socket.emit(event, data);
  }

  // Listen methods
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) {
      console.warn('Socket not initialized');
      return;
    }
    this.socket.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  once(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) {
      console.warn('Socket not initialized');
      return;
    }
    this.socket.once(event, callback);
  }

  // Lobby events
  createRoom(data: { mode: string; maxPlayers: number; entryFee: number; settings: any }) {
    this.emit('createRoom', data);
  }

  joinRoom(data: { roomId: string; asPlayer: boolean }) {
    this.emit('joinRoom', data);
  }

  leaveRoom(data: { roomId: string }) {
    this.emit('leaveRoom', data);
  }

  playerReady() {
    this.emit('playerReady');
  }

  playerUnready() {
    this.emit('playerUnready');
  }

  inviteFriend(data: { roomId: string; friendId: string }) {
    this.emit('inviteFriend', data);
  }

  swapRole(data: { newRole: 'player' | 'observer' }) {
    this.emit('swapRole', data);
  }

  kickPlayer(data: { playerId: string }) {
    this.emit('kickPlayer', data);
  }

  rematch() {
    this.emit('rematch');
  }

  // Game events
  playCard(data: { cardId: string }) {
    this.emit('playCard', data);
  }

  drawCard() {
    this.emit('drawCard');
  }

  declareWhot(data: { shape: string }) {
    this.emit('declareWhot', data);
  }

  pickTwo(data: { acceptOrChallenge: 'accept' | 'challenge' }) {
    this.emit('pickTwo', data);
  }

  requestCards(data: { fromPlayerId: string; count: number }) {
    this.emit('requestCards', data);
  }

  suspendPlayer(data: { playerId: string }) {
    this.emit('suspendPlayer', data);
  }

  // Observer events
  raiseHand() {
    this.emit('raiseHand');
  }

  lowerHand() {
    this.emit('lowerHand');
  }

  observerMessage(data: { message: string }) {
    this.emit('observerMessage', data);
  }

  // Video/Audio events
  toggleAudio(data: { muted: boolean }) {
    this.emit('toggleAudio', data);
  }

  toggleVideo(data: { disabled: boolean }) {
    this.emit('toggleVideo', data);
  }

  muteObserver(data: { observerId: string }) {
    this.emit('muteObserver', data);
  }

  unmuteObserver(data: { observerId: string }) {
    this.emit('unmuteObserver', data);
  }

  // Getter
  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  get socketId(): string | undefined {
    return this.socket?.id;
  }
}

export default new SocketService();