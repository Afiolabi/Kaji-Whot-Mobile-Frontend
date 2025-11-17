import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { dailyClient } from '@/services/daily.service';
import { setConnected, setLocalAudio, setLocalVideo, setRoomUrl } from '@/store/slices/webrtcSlice';

export const useWebRTC = (roomId: string | null) => {
  const dispatch = useAppDispatch();
  const { localStream, remoteStreams, isConnected, localAudioEnabled, localVideoEnabled } =
    useAppSelector((state) => state.webrtc);
  const user = useAppSelector((state) => state.user);
  const hasJoined = useRef(false);
  useEffect(() => {
    const initVideo = async () => {
      if (!roomId || !user || hasJoined.current) return;

      try {
        // Create or get room URL
        const roomUrl = await dailyClient.createRoom(roomId);
        dispatch(setRoomUrl(roomUrl ?? ''));

        // Join the room
        await dailyClient.joinRoom(roomUrl ?? '', user.user ? user?.user.username : 'User');
        dispatch(setConnected(true));
        hasJoined.current = true;
      } catch (error) {
        console.error('Failed to initialize video:', error);
        dispatch(setConnected(false));
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
    const newState = !localAudioEnabled;
    await dailyClient.toggleLocalAudio(!newState);
    dispatch(setLocalAudio(newState));
  };

  const toggleVideo = async () => {
    const newState = !localVideoEnabled;
    await dailyClient.toggleLocalVideo(!newState);
    dispatch(setLocalVideo(newState));
  };

  const leaveRoom = async () => {
    await dailyClient.leaveRoom();
    dispatch(setConnected(false));
    hasJoined.current = false;
  };

  return {
    localStream,
    remoteStreams,
    isConnected,
    localAudioEnabled,
    localVideoEnabled,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  };
};
