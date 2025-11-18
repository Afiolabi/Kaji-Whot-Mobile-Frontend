import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Header from '@components/common/Header';

// Icons
const BackIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="#484848"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill={filled ? '#FFB400' : 'none'}>
    <Path
      d="M12 2L14.5 9L22 9.5L16.5 14.5L18 22L12 18L6 22L7.5 14.5L2 9.5L9.5 9L12 2Z"
      stroke="#FFB400"
      strokeWidth="2"
      fill={filled ? '#FFB400' : 'none'}
    />
  </Svg>
);

// Types
interface RankTier {
  id: string;
  name: string;
  fee: number;
  stars: number;
}

interface Room {
  id: string;
  host: string;
  players: number;
  maxPlayers: number;
  status: 'Live' | 'Starting in' | 'Game ended';
  timeRemaining: string;
}

// Mock data
const RANK_TIERS: RankTier[] = [
  { id: 'amateur', name: 'Amateur', fee: 50, stars: 1 },
  { id: 'master', name: 'Whot Master', fee: 100, stars: 2 },
  { id: 'lord', name: 'Whot Lord', fee: 200, stars: 3 },
];

const MOCK_ROOMS: { [key: string]: Room[] } = {
  amateur: [
    {
      id: '1',
      host: 'Officer woos',
      players: 2,
      maxPlayers: 4,
      status: 'Live',
      timeRemaining: '2:15s',
    },
    {
      id: '2',
      host: 'Broda Shaggi',
      players: 4,
      maxPlayers: 4,
      status: 'Game ended',
      timeRemaining: '5:12s',
    },
    {
      id: '3',
      host: 'Davido',
      players: 2,
      maxPlayers: 4,
      status: 'Starting in',
      timeRemaining: '2:15s',
    },
    {
      id: '4',
      host: 'Shanks',
      players: 1,
      maxPlayers: 3,
      status: 'Starting in',
      timeRemaining: '--:--',
    },
  ],
  master: [
    {
      id: '5',
      host: 'Player One',
      players: 3,
      maxPlayers: 4,
      status: 'Live',
      timeRemaining: '1:30s',
    },
    {
      id: '6',
      host: 'Player Two',
      players: 2,
      maxPlayers: 4,
      status: 'Starting in',
      timeRemaining: '0:45s',
    },
  ],
  lord: [
    {
      id: '7',
      host: 'Pro Player',
      players: 4,
      maxPlayers: 4,
      status: 'Live',
      timeRemaining: '3:20s',
    },
  ],
};

// Components
const RankTierCard = ({
  tier,
  isSelected,
  onPress,
}: {
  tier: RankTier;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className={`
      p-4 rounded-2xl border-2 mb-3 w-full
      ${isSelected ? 'border-primary bg-primary/5' : 'border-neutral-200 bg-white'}
    `}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-lg font-bold text-neutral-900 mb-1">{tier.name}</Text>
        <View className="flex-row items-center">
          {Array.from({ length: tier.stars }).map((_, i) => (
            <View className="mr-1">
              <StarIcon filled />
            </View>
          ))}
        </View>
      </View>
      <Text className="text-xl font-bold text-primary">₦{tier.fee}</Text>
    </View>
  </TouchableOpacity>
);

export default function SelectRank() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string>('amateur');

  useEffect(() => {});

  const handleJoinRoom = (id: string) => {
    setSelectedTier(id);
    console.log('id= ', id);
    // Navigate to lobby
    router.push(`/(game)/join-create-game?mode=${id}` as any);
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header hasNotification />

      {/* Tier Selection */}
      <Text className="text-lg mt-[40%] font-semibold text-neutral-600 px-8">
        Create or join a game
      </Text>
      <View className="mb-5 px-8 py-4">
        <FlatList
          data={RANK_TIERS}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RankTierCard
              tier={item}
              isSelected={selectedTier === item.id}
              onPress={() => handleJoinRoom(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false} // optional
        />
      </View>
      {/* Back Button */}
      <View className="items-end px-8">
        <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
