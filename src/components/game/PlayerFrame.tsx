import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Player } from '@/store/slices/gameSlice';

interface PlayerFrameProps {
  player: Player;
  isActive: boolean;
  isMe: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const MicIcon = ({ muted }: { muted: boolean }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    {muted ? (
      <>
        <Path
          d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
          stroke="#000"
          strokeWidth="2"
        />
        <Path
          d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V23M8 23H16"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path d="M3 3L21 21" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </>
    ) : (
      <>
        <Path
          d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
          stroke="#000"
          strokeWidth="2"
        />
        <Path
          d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V23M8 23H16"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    )}
  </Svg>
);

const VideoIcon = ({ disabled }: { disabled: boolean }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    {disabled ? (
      <>
        <Path
          d="M16 16V8C16 6.89543 15.1046 6 14 6H6C4.89543 6 4 6.89543 4 8V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16Z"
          stroke="#000"
          strokeWidth="2"
        />
        <Path
          d="M16 10L21 7V17L16 14"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M3 3L21 21" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </>
    ) : (
      <>
        <Path
          d="M16 16V8C16 6.89543 15.1046 6 14 6H6C4.89543 6 4 6.89543 4 8V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16Z"
          stroke="#000"
          strokeWidth="2"
        />
        <Path
          d="M16 10L21 7V17L16 14"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </Svg>
);

const DefaultAvatar = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke="#B0B0B0" strokeWidth="2" />
    <Path
      d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21"
      stroke="#B0B0B0"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const PlayerFrame: React.FC<PlayerFrameProps> = ({ player, isActive, isMe, position }) => {
  const positionClasses = {
    'top-left': 'absolute top-2 left-2',
    'top-right': 'absolute top-2 right-2',
    'bottom-left': 'absolute bottom-2 left-2',
    'bottom-right': 'absolute bottom-2 right-2',
  };

  return (
    <View className={positionClasses[position]}>
      <TouchableOpacity activeOpacity={0.9}>
        <View
          className={`w-28 h-36 rounded-xl overflow-hidden ${
            isActive ? 'border-4 border-primary' : 'border-2 border-neutral-300'
          }`}
          style={{
            shadowColor: isActive ? '#FF385C' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isActive ? 0.5 : 0.25,
            shadowRadius: isActive ? 8 : 4,
            elevation: isActive ? 8 : 4,
          }}
        >
          {/* Video/Avatar Area */}
          <View className="flex-1 bg-neutral-800 items-center justify-center">
            {player.avatar ? (
              <Image
                source={{ uri: player.avatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <DefaultAvatar />
            )}
          </View>

          {/* Player Info Overlay */}
          <View className="absolute bottom-0 left-0 right-0 bg-black/80 px-2 py-1">
            <Text className="text-white text-xs font-semibold" numberOfLines={1}>
              {player.username}
            </Text>
          </View>

          {/* Card Count Badge */}
          <View className="absolute top-1 right-1">
            <View
              className={`px-2 py-0.5 rounded-full ${
                player.isLastCard ? 'bg-error' : 'bg-neutral-800/80'
              }`}
            >
              <Text className="text-white text-xs font-bold">{player.cardCount}</Text>
            </View>
          </View>

          {/* Last Card Warning */}
          {player.isLastCard && (
            <View className="absolute top-1 left-1 bg-error/90 px-1.5 py-0.5 rounded">
              <Text className="text-white text-[10px] font-bold">Last Card</Text>
            </View>
          )}

          {/* Disconnected Indicator */}
          {player.isDisconnected && (
            <View className="absolute inset-0 bg-black/70 items-center justify-center">
              <Text className="text-white text-xs font-semibold">Disconnected</Text>
            </View>
          )}

          {/* Audio/Video Status Icons */}
          <View className="absolute bottom-8 left-1 flex-row gap-1">
            {player.audioMuted && (
              <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
                <MicIcon muted={true} />
              </View>
            )}
            {player.videoDisabled && (
              <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
                <VideoIcon disabled={true} />
              </View>
            )}
          </View>

          {/* Turn Pulse Animation */}
          {isActive && (
            <View
              className="absolute inset-0 border-4 border-primary rounded-xl"
              style={{
                opacity: 0.3,
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PlayerFrame;