import Daily, { DailyCall, DailyParticipant, DailyEventObject } from '@dailyco/react-native-daily-js';
import { store } from '@store/index';
import { 
  setConnected, 
  setConnecting, 
  setVideoRoom, 
  setLocalStream, 
  addRemoteStream, 
  removeRemoteStream,
  setWebRTCError,
  setRoomUrl
} from '@store/slices/webrtcSlice';

class DailyService {
  private callObject: DailyCall | null = null;

  async createRoom(roomUrl: string): Promise<void> {
    try {
      store.dispatch(setConnecting(true));
      store.dispatch(setRoomUrl(roomUrl));

      // Create Daily call object
      this.callObject = Daily.createCallObject({
        url: roomUrl,
      });

      // Set up event listeners
      this.setupEventListeners();

      // Join the room
      await this.callObject.join();

      store.dispatch(setVideoRoom(this.callObject));
      store.dispatch(setConnected(true));
    } catch (error: any) {
      console.error('Error creating Daily room:', error);
      store.dispatch(setWebRTCError(error.message || 'Failed to connect to video room'));
      store.dispatch(setConnecting(false));
    }
  }

  private setupEventListeners() {
    if (!this.callObject) return;

    // Joined meeting
    this.callObject.on('joined-meeting', (event: DailyEventObject) => {
      console.log('Joined meeting:', event);
      const participants = this.callObject?.participants();
      
      if (participants?.local) {
        const localStream = participants.local.tracks;
        if (localStream) {
          store.dispatch(setLocalStream(localStream));
        }
      }
    });

    // Participant joined
    this.callObject.on('participant-joined', (event: DailyEventObject) => {
      console.log('Participant joined:', event.participant);
      
      if (event.participant && event.participant.session_id) {
        const stream = event.participant.tracks;
        if (stream) {
          store.dispatch(addRemoteStream({
            userId: event.participant.session_id,
            stream,
          }));
        }
      }
    });

    // Participant updated (camera/mic changes)
    this.callObject.on('participant-updated', (event: DailyEventObject) => {
      console.log('Participant updated:', event.participant);
      
      if (event.participant && event.participant.session_id) {
        const stream = event.participant.tracks;
        if (stream) {
          store.dispatch(addRemoteStream({
            userId: event.participant.session_id,
            stream,
          }));
        }
      }
    });

    // Participant left
    this.callObject.on('participant-left', (event: DailyEventObject) => {
      console.log('Participant left:', event.participant);
      
      if (event.participant && event.participant.session_id) {
        store.dispatch(removeRemoteStream(event.participant.session_id));
      }
    });

    // Track started
    this.callObject.on('track-started', (event: DailyEventObject) => {
      console.log('Track started:', event);
    });

    // Track stopped
    this.callObject.on('track-stopped', (event: DailyEventObject) => {
      console.log('Track stopped:', event);
    });

    // Error handling
    this.callObject.on('error', (event: DailyEventObject) => {
      console.error('Daily error:', event);
      store.dispatch(setWebRTCError(event.errorMsg || 'Video call error occurred'));
    });

    // Left meeting
    this.callObject.on('left-meeting', (event: DailyEventObject) => {
      console.log('Left meeting:', event);
      store.dispatch(setConnected(false));
    });
  }

  async leaveRoom(): Promise<void> {
    if (!this.callObject) return;

    try {
      await this.callObject.leave();
      await this.callObject.destroy();
      this.callObject = null;
      store.dispatch(setConnected(false));
    } catch (error: any) {
      console.error('Error leaving room:', error);
      store.dispatch(setWebRTCError(error.message || 'Failed to leave video room'));
    }
  }

  async toggleLocalAudio(enabled: boolean): Promise<void> {
    if (!this.callObject) return;

    try {
      await this.callObject.setLocalAudio(enabled);
    } catch (error: any) {
      console.error('Error toggling audio:', error);
    }
  }

  async toggleLocalVideo(enabled: boolean): Promise<void> {
    if (!this.callObject) return;

    try {
      await this.callObject.setLocalVideo(enabled);
    } catch (error: any) {
      console.error('Error toggling video:', error);
    }
  }

  async setScreenShare(enabled: boolean): Promise<void> {
    if (!this.callObject) return;

    try {
      if (enabled) {
        await this.callObject.startScreenShare();
      } else {
        await this.callObject.stopScreenShare();
      }
    } catch (error: any) {
      console.error('Error with screen share:', error);
    }
  }

  getParticipants(): { [id: string]: DailyParticipant } | null {
    if (!this.callObject) return null;
    return this.callObject.participants();
  }

  getLocalParticipant(): DailyParticipant | null {
    const participants = this.getParticipants();
    return participants?.local || null;
  }

  isConnected(): boolean {
    return !!this.callObject && this.callObject.meetingState() === 'joined-meeting';
  }
}

export default new DailyService();