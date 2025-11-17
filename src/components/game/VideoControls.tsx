/* eslint-disable @typescript-eslint/no-unused-vars */
import { View, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Player } from '../../types/game.types';

interface VideoControlsProps {
  player: Player;
  onClose: () => void;
}

// Icon components using react-native-svg
const MicIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <Path d="M12 19v3" />
  </Svg>
);

const MicOffIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M2 2l20 20" />
    <Path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
    <Path d="M5 10v2a7 7 0 0 0 12 5" />
    <Path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
    <Path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
    <Path d="M12 19v3" />
  </Svg>
);

const VideoIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
    <Path d="M2 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
  </Svg>
);

const VideoOffIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8" />
    <Path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z" />
    <Path d="M2 2 22 22" />
  </Svg>
);

const VideoControls: React.FC<VideoControlsProps> = ({ player, onClose }) => {
  return (
    <View className="absolute inset-x-0 inset-y-2/3  bg-black/50 flex items-center justify-center gap-4 flex-row space-x-4">
      <TouchableOpacity
        className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center active:bg-gray-200"
        onPress={(e) => {
          e.stopPropagation();
          // Handle mute/unmute
        }}
      >
        {player.audioMuted ? <MicOffIcon /> : <MicIcon />}
      </TouchableOpacity>

      <TouchableOpacity
        className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center active:bg-gray-200"
        onPress={(e) => {
          e.stopPropagation();
          // Handle video on/off
        }}
      >
        {player.videoDisabled ? <VideoOffIcon /> : <VideoIcon />}
      </TouchableOpacity>
    </View>
  );
};

export default VideoControls;
