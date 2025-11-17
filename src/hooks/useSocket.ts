/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect } from 'react';
import { socketClient } from '@/services/socket.service';
import { SOCKET_EVENTS } from '@/services/socketEvents';

export const useSocket = () => {
  const emit = (event: string, data?: any) => {
    socketClient.emit(event, data);
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    socketClient.on(event, callback);
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    socketClient.off(event, callback);
  };

  return {
    emit,
    on,
    off,
    // isConnected: socketClient.isConnected(),
    events: SOCKET_EVENTS,
  };
};

export const useGameActions = () => {
  const { emit, events } = useSocket();

  return {
    playCard: (cardId: string) => emit(events.PLAY_CARD, { cardId }),
    drawCard: () => emit(events.DRAW_CARD),
    declareWhot: (shape: string) => emit(events.DECLARE_WHOT, { shape }),
    pickTwo: (action: 'accept' | 'challenge') => emit(events.PICK_TWO, { action }),
  };
};

export const useLobbyActions = () => {
  const { emit, events } = useSocket();

  return {
    createRoom: (data: any) => emit(events.CREATE_ROOM, data),
    joinRoom: (roomId: string, asPlayer: boolean) => emit(events.JOIN_ROOM, { roomId, asPlayer }),
    leaveRoom: (roomId: string) => emit(events.LEAVE_ROOM, { roomId }),
    setReady: () => emit(events.PLAYER_READY),
    setUnready: () => emit(events.PLAYER_UNREADY),
    swapRole: (newRole: 'player' | 'observer') => emit(events.SWAP_ROLE, { newRole }),
    inviteFriend: (roomId: string, friendId: string) => emit(events.INVITE_FRIEND, { roomId, friendId }),
    kickPlayer: (playerId: string) => emit(events.KICK_PLAYER, { playerId }),
    initiateRematch: () => emit(events.REMATCH),
  };
};

export const useObserverActions = () => {
  const { emit, events } = useSocket();

  return {
    raiseHand: () => emit(events.RAISE_HAND),
    lowerHand: () => emit(events.LOWER_HAND),
    sendMessage: (message: string) => emit(events.OBSERVER_MESSAGE, { message }),
  };
};

export const useVideoActions = () => {
  const { emit, events } = useSocket();

  return {
    toggleAudio: (muted: boolean) => emit(events.TOGGLE_AUDIO, { muted }),
    toggleVideo: (disabled: boolean) => emit(events.TOGGLE_VIDEO, { disabled }),
    muteObserver: (observerId: string) => emit(events.MUTE_OBSERVER, { observerId }),
    unmuteObserver: (observerId: string) => emit(events.UNMUTE_OBSERVER, { observerId }),
  };
};