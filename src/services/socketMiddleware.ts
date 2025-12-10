/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Middleware } from '@reduxjs/toolkit';
import { socketClient } from './socket.service';
import { SOCKET_EVENTS } from './socketEvents';
import {
  setGameState,
  updatePlayers,
  updatePlayer,
  addPlayedCard,
  updateMyHand,
  setTurn,
  endGame,
  addObserver as addGameObserver,
  removeObserver as removeGameObserver,
  updateObserver as updateGameObserver,
} from '@/store/slices/gameSlice';
import {
  startCountdown,
  decrementCountdown,
  createLobby,
  joinLobby,
  leaveLobby,
  addPlayer,
  removePlayer,
  addObserver,
  removeObserver,
  updateObserver,
  togglePlayerReady,
  setCountdown,
  Observer,
  LobbyState,
  LobbyPlayer,
  // addChatMessage,
} from '@/store/slices/lobbySlice';
import { addNotification } from '@/store/slices/uiSlice';
import { Card, PlayedCard } from '@/types/card.types';
// import { addNotification } from '@/store/slices/notifications/slices/notificationsSlice';
// import { LobbyState } from '@/features/lobby/types/lobby.types';
// import { Observer } from '@/features/game/types/game.types';
// import { Card } from '@/features/game/types/card.types';

export const socketMiddleware: Middleware = (storeAPI) => {
  return (next) => (action) => {
    const { type } = action;
    // Setup socket listeners when user logs in
    if (type === 'auth/login/fulfilled' || type === 'auth/fetchCurrentUser/fulfilled') {
      const token = storeAPI.getState().auth.token;
      if (token) {
        socketClient.connect();
        setupSocketListeners(storeAPI);
      }
    }

    // Disconnect socket when user logs out
    if (type === 'auth/logout') {
      socketClient.disconnect();
    }

    return next(action);
  };
};

function setupSocketListeners(storeAPI: any) {
  const socket = socketClient;
  if (!socket) return;

  // Room Events
  socket.on(SOCKET_EVENTS.ROOM_CREATED, (data: Partial<LobbyState>) => {
    console.log('Room created:', data);
    storeAPI.dispatch(
      createLobby({
        roomId: data.roomId || 'unknown',
        host: data.host || 'unknown',
        settings: data.settings || {},
      })
    );
    storeAPI.dispatch(
      addPlayer({
        id: data.host || '',
        username: data.hostUsername,
        avatar: data.hostAvatar,
        isReady: true,
        isHost: true,
      })
    );
  });

  socket.on(SOCKET_EVENTS.PLAYER_JOINED, (data: any) => {
    console.log('Player joined:', data);
    storeAPI.dispatch(
      addPlayer({
        id: data.player.id,
        username: data.player.username,
        avatar: data.player.avatar,
        isReady: false,
        isHost: false,
      })
    );
    storeAPI.dispatch(
      addNotification({
        type: 'info',
        message: `${data.player.username} joined the room`,
      })
    );
  });

  socket.on(SOCKET_EVENTS.PLAYER_LEFT, (data: any) => {
    console.log('Player left:', data);
    storeAPI.dispatch(removePlayer(data.playerId));
    storeAPI.dispatch(
      addNotification({
        type: 'info',
        message: `${data.username} left the room`,
      })
    );
  });

  socket.on(SOCKET_EVENTS.OBSERVER_JOINED, (data: { observer: Observer }) => {
    console.log('Observer joined:', data);
    storeAPI.dispatch(
      addObserver({
        id: data.observer.id,
        username: data.observer.username,
        avatar: data.observer.avatar,
        handRaised: false,
        isUnmuted: false,
        videoStream: null,
      })
    );
    storeAPI.dispatch(
      addNotification({
        type: 'info',
        message: `${data.observer.username} joined as observer`,
      })
    );
  });

  socket.on(SOCKET_EVENTS.PLAYER_READY, (data: any) => {
    console.log('Player ready:', data);
    storeAPI.dispatch(togglePlayerReady(data.playerId));
  });

  socket.on(SOCKET_EVENTS.PLAYER_UNREADY, (data: any) => {
    console.log('Player unready:', data);
    storeAPI.dispatch(togglePlayerReady(data.playerId));
  });

  socket.on(SOCKET_EVENTS.GAME_START_COUNTDOWN, (data: { seconds: number }) => {
    console.log('Game starting countdown:', data.seconds);
    storeAPI.dispatch(startCountdown(data.seconds));

    // Countdown ticker
    // const interval = setInterval(() => {
    //   const countdown = storeAPI.getState().lobby.countdown;
    //   if (countdown === null || countdown <= 0) {
    //     clearInterval(interval);
    //   } else {
    //     storeAPI.dispatch(decrementCountdown());
    //   }
    // }, 1000);
    let currentCountdown = data.seconds;
    const interval = setInterval(() => {
      currentCountdown -= 1;
      if (currentCountdown <= 0) {
        clearInterval(interval);
        storeAPI.dispatch(setCountdown(null));
      } else {
        storeAPI.dispatch(setCountdown(currentCountdown));
      }
    }, 1000);
  });
  // ============== GAME EVENTS ==============

  socket.on(SOCKET_EVENTS.GAME_STARTED, (data: any) => {
    console.log('Game started:', data);
    storeAPI.dispatch(leaveLobby());

    storeAPI.dispatch(leaveLobby());
    storeAPI.dispatch(
      setGameState({
        ...data.gameState,
        status: 'active',
        startTime: Date.now(),
      })
    );
    storeAPI.dispatch(updatePlayers(data.players));
    storeAPI.dispatch(updateMyHand(data.myHand));
  });

  socket.on(SOCKET_EVENTS.TURN_CHANGED, (data: any) => {
    console.log('Turn changed:', data);
    storeAPI.dispatch(
      setTurn({
        playerId: data.newPlayerId,
        timer: data.timeLimit,
      })
    );

    const currentUserId = storeAPI.getState().auth.user?.id;
    if (data.newPlayerId === currentUserId) {
      storeAPI.dispatch(
        addNotification({
          type: 'info',
          message: "It's your turn!",
          duration: 3000,
        })
      );
    }
  });

  socket.on(
    SOCKET_EVENTS.CARD_PLAYED,
    (data: { card: PlayedCard; playerId: any; cardCount: number }) => {
      console.log('Card played:', data);
      storeAPI.dispatch(addPlayedCard(data.card));
      storeAPI.dispatch(
        updatePlayer({
          playerId: data.playerId,
          updates: { cardCount: data.cardCount, isLastCard: data.cardCount === 1 },
        })
      );
    }
  );

  socket.on(SOCKET_EVENTS.CARD_DRAWN, (data: { playerId: any; hand: Card[]; cardCount: any }) => {
    console.log('Card drawn:', data);
    const currentUserId = storeAPI.getState().auth.user?.id;

    if (data.playerId === currentUserId) {
      // Update my hand if I drew the card
      storeAPI.dispatch(updateMyHand(data.hand));
    } else {
      // Update other player's card count
      storeAPI.dispatch(
        updatePlayer({
          playerId: data.playerId,
          updates: { cardCount: data.cardCount },
        })
      );
    }
  });

  socket.on(SOCKET_EVENTS.PLAYER_DISCONNECTED, (data: { playerId: any; username: any }) => {
    console.log('Player disconnected:', data);
    storeAPI.dispatch(
      updatePlayer({
        playerId: data.playerId,
        updates: { isDisconnected: true, disconnectedAt: Date.now() },
      })
    );
    storeAPI.dispatch(
      addNotification({
        type: 'warning',
        message: `${data.username} disconnected`,
      })
    );
  });

  socket.on(SOCKET_EVENTS.PLAYER_RECONNECTED, (data: { playerId: any; username: any }) => {
    console.log('Player reconnected:', data);
    storeAPI.dispatch(
      updatePlayer({
        playerId: data.playerId,
        updates: { isDisconnected: false, disconnectedAt: null },
      })
    );
    storeAPI.dispatch(
      addNotification({
        type: 'success',
        message: `${data.username} reconnected`,
      })
    );
  });

  socket.on(SOCKET_EVENTS.PLAYER_REPLACED, (data: { oldId: string; newPlayer: LobbyPlayer }) => {
    console.log('Player replaced:', data);
    storeAPI.dispatch(removePlayer(data.oldId));
    storeAPI.dispatch(addPlayer(data.newPlayer));
    storeAPI.dispatch(removeObserver(data.newPlayer.id));
  });

  socket.on(SOCKET_EVENTS.GAME_ENDED, (data: { results: { winner: { id: any } } }) => {
    console.log('Game ended:', data);
    storeAPI.dispatch(
      endGame({
        winner: data.results.winner.id,
        endTime: Date.now(),
      })
    );
    // Results modal will be shown by GameRoom component
  });

  socket.on(SOCKET_EVENTS.REMATCH_INITIATED, (data: any) => {
    console.log('Rematch initiated:', data);
    storeAPI.dispatch(
      addNotification({
        type: 'info',
        message: 'Host initiated a rematch!',
      })
    );
  });

  socket.on(SOCKET_EVENTS.OBSERVER_HAND_RAISED, (data: any) => {
    console.log('✋ Observer raised hand:', data);
    storeAPI.dispatch(
      updateGameObserver({
        observerId: data.observerId,
        updates: { handRaised: true },
      })
    );
  });

  socket.on(SOCKET_EVENTS.OBSERVER_UNMUTED, (data: any) => {
    console.log('🔊 Observer unmuted:', data);
    storeAPI.dispatch(
      updateGameObserver({
        observerId: data.observerId,
        updates: { isUnmuted: true },
      })
    );
  });

  socket.on(SOCKET_EVENTS.ERROR, (data: { message: any }) => {
    console.error('Socket error:', data);
    storeAPI.dispatch(
      addNotification({
        type: 'error',
        message: data.message,
      })
    );
  });

  // Chat message
  socket.on('chatMessage', (data: any) => {
    console.log('💬 Chat message:', data);
    // This is handled in the component directly
  });

  // Room list updates
  socket.on('roomUpdated', (data: any) => {
    console.log('🔄 Room updated:', data);
    // This triggers a refresh in join-create-game
  });
}
