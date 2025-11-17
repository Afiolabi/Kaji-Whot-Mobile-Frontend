import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useMediaStream } from '@/hooks/useMediaStream';
import { Player } from '../../types/game.types';
import VideoControls from './VideoControls';

interface PlayerFrameProps {
  player: Player;
  isActive: boolean;
  isMe: boolean;
}

const PlayerFrame: React.FC<PlayerFrameProps> = ({ player, isActive, isMe }) => {
  const [showControls, setShowControls] = useState(false);
  const videoRef = useMediaStream(player.videoStream);

  return (
    <TouchableOpacity
      className={`relative w-full h-full rounded-lg overflow-hidden border-4 transition-all ${
        isActive 
          ? 'border-primary-500 animation-turn-pulse' 
          : 'border-gray-700'
      }`}
      onPress={() => setShowControls(!showControls)}
      activeOpacity={0.9}
    >
      {/* Video Feed */}
      <Video
        ref={videoRef}
        className="w-full h-full bg-gray-900"
        source={{ uri: player?.videoStream }}
        shouldPlay
        isMuted={isMe}
        resizeMode={ResizeMode.COVER}
      />

      {/* Player Info Overlay */}
      <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
        <Text className="text-white text-sm font-semibold">{player.username}</Text>
      </View>

      {/* Card Count Badge */}
      <View className="absolute top-2 right-2">
        <View className={`px-2 py-1 rounded-full text-sm font-bold ${
          player.isLastCard ? 'bg-red-500 animation-turn-pulse' : 'bg-gray-800'
        } text-white`}>
          <Text className="text-white text-sm font-bold">{player.cardCount}</Text>
        </View>
      </View>

      {/* Last Card Warning */}
      {player.isLastCard && (
        <View className="absolute top-2 left-2">
          <Text className="text-red-500 text-xs font-bold animation-turn-pulse">
            Last card
          </Text>

        </View>
      )}

      {/* Disconnected Indicator */}
      {player.isDisconnected && (
        <View className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <Text className="text-white text-sm">Disconnected</Text>
        </View>
      )}

      {/* Video Controls Overlay */}
      {showControls  && (
        <VideoControls
          player={player}
          onClose={() => setShowControls(false)}
        />
      )}
    </TouchableOpacity>
  );
};

export default PlayerFrame;