import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Header from '@components/common/Header';
import Button from '@components/common/Button';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';

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

const PlusIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke="#FF385C"
      strokeWidth="2.5"
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

interface PlayerSlotProps {
  type: 'player' | 'bot' | 'empty';
  label?: string;
  isSelected?: boolean;
  onPress?: () => void;
}

export const PlayerSlot = ({ type, label, isSelected, onPress }: PlayerSlotProps) => {
  if (type === 'player') {
    return (
      <View className="items-center">
        <View className="w-20 h-24 rounded-2xl bg-neutral-200 items-center justify-center mb-2">
          <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke="#6A6A6A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="#6A6A6A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <Text className="text-sm font-semibold text-neutral-900">{label}</Text>
      </View>
    );
  }

  if (type === 'bot') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="items-center">
        <View className="w-20 h-24 rounded-2xl bg-neutral-200 items-center justify-center mb-2">
          <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke="#6A6A6A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="#6A6A6A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <Text className="text-sm font-semibold text-neutral-900">{label}</Text>
      </TouchableOpacity>
    );
  }

  // Empty slot with plus sign
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="items-center">
      <View
        className={`
          w-20 h-24 rounded-2xl items-center justify-center mb-5
          border-2 ${isSelected ? 'border-primary bg-primary/10' : 'border-neutral-900 bg-white'}
        `}
      >
        <PlusIcon />
      </View>
    </TouchableOpacity>
  );
};

export default function SelectPlayers() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user = useAppSelector((state: RootState) => state.user.user);

  const mode = params.mode as string; // 'offline' | 'rank' | 'free' | 'celebrity'
  // const tier = params.tier as string; // For rank mode
  const fee = params.fee ? Number(params.fee) : 0; // Entry fee
  // console.log('mode/rank = ', mode, '/', tier);
  const [selectedBotCount, setSelectedBotCount] = useState<number>(mode === 'offline' ? 1 : 0);

  const getTierStars = () => {
    switch (mode) {
      case 'amateur':
        return 1;
      case 'master':
        return 2;
      case 'lord':
        return 3;
      default:
        return 0;
    }
  };

  const getTierName = () => {
    switch (mode) {
      case 'amateur':
        return 'Amateur';
      case 'master':
        return 'Whot Master';
      case 'lord':
        return 'Whot Lord';
      case 'offline':
        return 'Offline Room';
      case 'celebrity':
        return 'Celebrity Room';
      default:
        return 'Free Room';
    }
  };

  const handleContinue = () => {
    if (mode === 'offline') {
      router.push(`/(game)/game-screen/offline-${Date.now()}`);
      return;
    }

    // For online modes, create game and go to lobby
    const roomId = `room-${Date.now()}`;
    const gameMode = mode;
    //call createGame({
    // roomId,
    // gameMode,
    // user,
    // fee,
    //numberOfOpponents
    // })

    //fetch created game id
    //navigate to lobby with gameId
    router.replace(`/(game)/lobby/${roomId}` as any);
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header hasNotification />

      {/* Main Content */}
      <View className="flex-1 px-8 justify-center">
        {/* Title */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-neutral-900 mb-2">
            Kaji Whot | {getTierName()}
          </Text>
          {mode === 'rank' && (
            <View className="flex-row items-center">
              {Array.from({ length: getTierStars() }).map((_, i) => (
                <View className="mx-0.5">
                  <StarIcon filled />
                </View>
              ))}
            </View>
          )}
        </View>

        {mode === 'offline' ? (
          <Text className="text-base font-semibold text-neutral-600 text-center mb-8">
            Select number of opponents
          </Text>
        ) : (
          <Text className="text-base font-semibold text-neutral-600 text-center mb-8">
            Select number of opponents
          </Text>
        )}

        {/* Player Slots */}
        <View className="flex-row justify-center items-center gap-4 mb-16">
          {/* Current Player */}
          <PlayerSlot type="player" label="Me" />

          {mode === 'offline' ? (
            <>
              {/* Bot 1 - Always shown for offline */}
              <PlayerSlot type="bot" label="Bot 1" />

              {/* Bot 2 - Toggleable */}
              <PlayerSlot
                type={selectedBotCount >= 2 ? 'bot' : 'empty'}
                label="Bot 2"
                isSelected={selectedBotCount >= 2}
                onPress={() => {
                  if (selectedBotCount >= 2) {
                    setSelectedBotCount(1);
                  } else {
                    setSelectedBotCount(2);
                  }
                }}
              />

              {/* Bot 3 - Toggleable */}
              <PlayerSlot
                type={selectedBotCount >= 3 ? 'bot' : 'empty'}
                label="Bot 3"
                isSelected={selectedBotCount >= 3}
                onPress={() => {
                  if (selectedBotCount >= 3) {
                    setSelectedBotCount(2);
                  } else {
                    setSelectedBotCount(3);
                  }
                }}
              />
            </>
          ) : (
            <>
              {/* For online modes, show empty slots with plus icons */}
              <PlayerSlot
                type={selectedBotCount >= 1 ? 'bot' : 'empty'}
                label="Player 1"
                isSelected={selectedBotCount >= 1}
                onPress={() => {
                  setSelectedBotCount(selectedBotCount >= 1 ? 0 : 1);
                }}
              />

              <PlayerSlot
                type={selectedBotCount >= 2 ? 'bot' : 'empty'}
                label="Player 2"
                isSelected={selectedBotCount >= 2}
                onPress={() => {
                  setSelectedBotCount(selectedBotCount >= 2 ? 1 : 2);
                }}
              />

              <PlayerSlot
                type={selectedBotCount >= 3 ? 'bot' : 'empty'}
                label="Player 3"
                isSelected={selectedBotCount >= 3}
                onPress={() => {
                  setSelectedBotCount(selectedBotCount >= 3 ? 2 : 3);
                }}
              />
            </>
          )}
        </View>

        {mode !== 'free' && mode !== 'offline' && (
          <View className="items-center mb-8">
            <Text className="text-sm text-neutral-600 mb-1">Entry Fee</Text>
            <Text className="text-2xl font-bold text-primary">₦{fee}</Text>
            {/* <Text className="text-sm text-neutral-400 mt-1">
              Your balance: ₦{user?.balance || 0}
            </Text> */}
          </View>
        )}

        {/* Continue Button */}
        <Button
          title={mode === 'offline' ? 'Start' : 'Continue'}
          onPress={handleContinue}
          variant="outline"
          size="lg"
          fullWidth
        />

        {/* Back Button */}
        <View className="items-end mt-16">
          <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
            <BackIcon />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
