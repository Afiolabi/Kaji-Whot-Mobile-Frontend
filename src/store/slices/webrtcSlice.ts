import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebRTCState {
  localStream: any | null; // MediaStream
  remoteStreams: { [userId: string]: any }; // { [userId]: MediaStream }
  isConnected: boolean;
  isConnecting: boolean;
  videoRoom: any | null; // Daily.co room object
  error: string | null;
  localAudioEnabled: boolean;
  localVideoEnabled: boolean;
  roomUrl: string | null;
}

const initialState: WebRTCState = {
  localStream: null,
  remoteStreams: {},
  isConnected: false,
  isConnecting: false,
  videoRoom: null,
  error: null,
  localAudioEnabled: true,
  localVideoEnabled: true,
  roomUrl: null,
};

const webrtcSlice = createSlice({
  name: 'webrtc',
  initialState,
  reducers: {
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.isConnecting = false;
        state.error = null;
      }
    },
    setVideoRoom: (state, action: PayloadAction<any>) => {
      state.videoRoom = action.payload;
    },
    setRoomUrl: (state, action: PayloadAction<string>) => {
      state.roomUrl = action.payload;
    },
    setLocalStream: (state, action: PayloadAction<any>) => {
      state.localStream = action.payload;
    },
    addRemoteStream: (state, action: PayloadAction<{ userId: string; stream: any }>) => {
      state.remoteStreams[action.payload.userId] = action.payload.stream;
    },
    removeRemoteStream: (state, action: PayloadAction<string>) => {
      delete state.remoteStreams[action.payload];
    },
    toggleLocalAudio: (state) => {
      state.localAudioEnabled = !state.localAudioEnabled;
    },
    setLocalAudio: (state, action: PayloadAction<boolean>) => {
      state.localAudioEnabled = action.payload;
    },
    toggleLocalVideo: (state) => {
      state.localVideoEnabled = !state.localVideoEnabled;
    },
    setLocalVideo: (state, action: PayloadAction<boolean>) => {
      state.localVideoEnabled = action.payload;
    },
    setWebRTCError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    clearWebRTCError: (state) => {
      state.error = null;
    },
    resetWebRTC: () => initialState,
  },
});

export const {
  setConnecting,
  setConnected,
  setVideoRoom,
  setRoomUrl,
  setLocalStream,
  addRemoteStream,
  removeRemoteStream,
  toggleLocalAudio,
  setLocalAudio,
  toggleLocalVideo,
  setLocalVideo,
  setWebRTCError,
  clearWebRTCError,
  resetWebRTC,
} = webrtcSlice.actions;

export default webrtcSlice.reducer;