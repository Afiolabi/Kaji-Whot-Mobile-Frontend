import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
// import { dailyClient } from '@/services/webrtc/dailyClient';
import { setConnectionStatus, setRoomUrl, setAudioEnabled, setVideoEnabled } from '@/services/webrtc/webrtcSlice';
import { dailyClient } from '@/services/webrtc/dailyClient';

export const useWebRTC = (roomId: string | null) => {
  const dispatch = useAppDispatch();
  const { localStream, remoteStreams, isConnected, audioEnabled, videoEnabled } = useAppSelector(
    (state) => state.webrtc
  );
  const user = useAppSelector((state) => state.auth.user);
  const hasJoined = useRef(false);

  useEffect(() => {
    const initVideo = async () => {
      if (!roomId || !user || hasJoined.current) return;

      try {
        // Create or get room URL
        const roomUrl = await dailyClient.createRoom(roomId);
        dispatch(setRoomUrl(roomUrl));

        // Join the room
        await dailyClient.joinRoom(roomUrl, user.username);
        dispatch(setConnectionStatus(true));
        hasJoined.current = true;
      } catch (error) {
        console.error('Failed to initialize video:', error);
        dispatch(setConnectionStatus(false));
      }
    };

    initVideo();

    return () => {
      // Cleanup on unmount
      if (hasJoined.current) {
        dailyClient.leaveRoom();
        hasJoined.current = false;
      }
    };
  }, [roomId, user, dispatch]);

  const toggleAudio = async () => {
    const newState = !audioEnabled;
    await dailyClient.toggleAudio(!newState);
    dispatch(setAudioEnabled(newState));
  };

  const toggleVideo = async () => {
    const newState = !videoEnabled;
    await dailyClient.toggleVideo(!newState);
    dispatch(setVideoEnabled(newState));
  };

  const leaveRoom = async () => {
    await dailyClient.leaveRoom();
    dispatch(setConnectionStatus(false));
    hasJoined.current = false;
  };

  return {
    localStream,
    remoteStreams,
    isConnected,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  };
};