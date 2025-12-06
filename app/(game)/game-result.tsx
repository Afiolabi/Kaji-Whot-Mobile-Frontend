import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

// Icons
const WalletIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 8H3M21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8M21 8V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CoinsIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.5 2 2 5.5 2 10C2 14.5 6.5 18 12 18C17.5 18 22 14.5 22 10C22 5.5 17.5 2 12 2Z"
      stroke="#000"
      strokeWidth="1.5"
      fill="none"
    />
    <Path d="M2 10v4c0 4.5 4.5 8 10 8s10-3.5 10-8v-4" stroke="#000" strokeWidth="1.5" fill="none" />
  </Svg>
);

const TrophyIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9H4.5C3.83696 9 3.20107 8.73661 2.73223 8.26777C2.26339 7.79893 2 7.16304 2 6.5C2 5.83696 2.26339 5.20107 2.73223 4.73223C3.20107 4.26339 3.83696 4 4.5 4H6"
      stroke="#FFB400"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 9H19.5C20.163 9 20.7989 8.73661 21.2678 8.26777C21.7366 7.79893 22 7.16304 22 6.5C22 5.83696 21.7366 5.20107 21.2678 4.73223C20.7989 4.26339 20.163 4 19.5 4H18"
      stroke="#FFB400"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 4V8C6 10.1217 6.84285 12.1566 8.34315 13.6569C9.84344 15.1571 11.8783 16 14 16H10C12.1217 16 14.1566 15.1571 15.6569 13.6569C17.1571 12.1566 18 10.1217 18 8V4H6Z"
      stroke="#FFB400"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M10 16V21H14V16" stroke="#FFB400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 21H16" stroke="#FFB400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LoadingIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 19.07L16.24 16.24M19.07 4.93L16.24 7.76M4.93 19.07L7.76 16.24M4.93 4.93L7.76 7.76"
      stroke="#B0B0B0"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Types
interface PlayerResult {
  id: string;
  username: string;
  avatar?: string;
  position: number;
  cardSum: number;
  cashEarned: number;
  coinsEarned: number;
  isWinner?: boolean;
}

// Mock data
const MOCK_RESULTS: PlayerResult[] = [
  { id: '1', username: 'John Doe', position: 1, cardSum: 0, cashEarned: 3000, coinsEarned: 50, isWinner: true },
  { id: '2', username: 'John Doe', position: 2, cardSum: 12, cashEarned: 1000, coinsEarned: 40 },
  { id: '3', username: 'John Doe', position: 3, cardSum: 34, cashEarned: 0, coinsEarned: 30 },
  { id: '4', username: 'John Doe', position: 4, cardSum: 50, cashEarned: 0, coinsEarned: 10 },
];

// Components
const PlayerAvatar = ({ username, position }: { username: string; position: number }) => {
  return (
    <View className="items-center">
      <View className="w-16 h-16 rounded-2xl bg-neutral-200 items-center justify-center mb-2 relative">
        <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke="#6A6A6A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path
            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
            stroke="#6A6A6A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
        {position === 1 && (
          <View className="absolute -top-2 -right-2">
            <TrophyIcon />
          </View>
        )}
      </View>
      <Text className="text-xs font-semibold text-neutral-900">{username}</Text>
    </View>
  );
};

const ResultRow = ({ player }: { player: PlayerResult }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (player.isWinner) {
      scale.value = withRepeat(
        withSequence(
          withSpring(1.02, { damping: 15 }),
          withSpring(1, { damping: 15 })
        ),
        -1,
        true
      );
    }
  }, [player.isWinner, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className={`flex-row items-center py-3 px-4 mb-2 rounded-xl ${
        player.isWinner ? 'bg-warning/10 border-2 border-warning' : 'bg-neutral-50'
      }`}
    >
      {/* Player Info */}
      <View className="flex-1">
        <Text className="text-sm font-semibold text-neutral-900">
          {player.position}. {player.username}
        </Text>
      </View>

      {/* Card Sum */}
      <View className="w-16 items-center">
        <Text className="text-sm font-bold text-neutral-900">{player.cardSum}</Text>
      </View>

      {/* Cash Earned */}
      <View className="w-24 items-center flex-row justify-center">
        <WalletIcon />
        <Text className={`text-sm font-bold ml-1 ${player.cashEarned > 0 ? 'text-success' : 'text-neutral-400'}`}>
          +{player.cashEarned}
        </Text>
      </View>

      {/* Coins Earned */}
      <View className="w-24 items-center flex-row justify-center">
        <CoinsIcon />
        <Text className="text-sm font-bold text-warning ml-1">+{player.coinsEarned}</Text>
      </View>

      {/* Winner Badge */}
      {player.isWinner && (
        <View className="absolute -right-2 -top-2 bg-warning rounded-full px-2 py-1 rotate-12">
          <Text className="text-white text-[10px] font-bold">Winner</Text>
        </View>
      )}
    </Animated.View>
  );
};

export default function GameResult() {
  const router = useRouter();
  const { roomId } = useLocalSearchParams();
  const [results] = useState<PlayerResult[]>(MOCK_RESULTS);
  const [showGiveaway, setShowGiveaway] = useState(false);
  const [giveawayLoading, setGiveawayLoading] = useState(true);

  useEffect(() => {
    // Simulate giveaway loading for celebrity rooms
    const timer = setTimeout(() => {
      setGiveawayLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    router.push('/(tabs)/landing');
  };

  const handleRematch = () => {
    // TODO: Implement rematch logic
    console.log('Rematch requested');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1 px-4 py-6">
        {/* Player Avatars */}
        <View className="flex-row justify-around mb-6">
          {results.map((player) => (
            <PlayerAvatar key={player.id} username={player.username} position={player.position} />
          ))}
        </View>

        {/* Results Title */}
        <Text className="text-2xl font-bold text-neutral-900 text-center mb-6">Result</Text>

        {/* Results Table Header */}
        <View className="flex-row items-center py-3 px-4 mb-2 border-b border-neutral-200">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-neutral-600">Player</Text>
          </View>
          <View className="w-16 items-center">
            <Text className="text-sm font-semibold text-neutral-600">card sum</Text>
          </View>
          <View className="w-24 items-center">
            <Text className="text-sm font-semibold text-neutral-600">cash</Text>
          </View>
          <View className="w-24 items-center">
            <Text className="text-sm font-semibold text-neutral-600">coin</Text>
          </View>
        </View>

        {/* Results Rows */}
        {results.map((player) => (
          <ResultRow key={player.id} player={player} />
        ))}

        {/* Give Away Section (for celebrity rooms) */}
        {showGiveaway && (
          <View className="mt-6 bg-neutral-50 rounded-2xl p-6 items-center border border-neutral-200">
            <Text className="text-xl font-bold text-neutral-900 mb-4">Give away</Text>
            {giveawayLoading ? (
              <View className="items-center">
                <LoadingIcon />
                <Text className="text-sm text-neutral-600 mt-3">Loading...</Text>
              </View>
            ) : (
              <View className="items-center">
                <Text className="text-lg font-semibold text-success mb-2">Congratulations!</Text>
                <Text className="text-sm text-neutral-600">You won ₦1,000 in the giveaway!</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View className="mt-8 gap-3">
          <TouchableOpacity
            onPress={handleRematch}
            className="bg-primary rounded-2xl p-4 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-white text-base font-bold">Rematch</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContinue}
            className="bg-white rounded-2xl p-4 items-center border-2 border-neutral-900"
            activeOpacity={0.7}
          >
            <Text className="text-neutral-900 text-base font-bold">Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}