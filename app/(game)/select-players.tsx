import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Header from '@components/common/Header';
import Button from '@components/common/Button';

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

interface PlayerSlotProps {
  type: 'player' | 'bot' | 'empty';
  label?: string;
  isSelected?: boolean;
  onPress?: () => void;
}

const PlayerSlot = ({ type, label, isSelected, onPress }: PlayerSlotProps) => {
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
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 5V19M5 12H19"
            stroke={isSelected ? '#FF385C' : '#000'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};

export default function OfflineMode() {
  const router = useRouter();
  const [selectedBotCount, setSelectedBotCount] = useState<number>(1); // Default to 1 bot

  const handleStart = () => {
    // Navigate to offline game room with bot count
    router.push(`/game-screen/084978394`);
    console.log(`Starting offline game with ${selectedBotCount} bots`);
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <View className="flex-1 px-8 justify-center ">
        {/* Title */}
        <Text className="text-2xl font-bold text-neutral-900 text-center mb-16">
          Select number of opponents
        </Text>

        {/* Player Slots */}
        <View className="flex-row justify-center items-center gap-4 mb-24">
          {/* Current Player */}
          <PlayerSlot type="player" label="Me" />

          {/* Bot 1 - Always shown */}
          <PlayerSlot type="bot" label="Bot 1" />

          {/* Bot 2 - Toggleable */}
          <PlayerSlot
            type={selectedBotCount >= 2 ? 'bot' : 'empty'}
            label="Bot 2"
            isSelected={selectedBotCount >= 2}
            onPress={() => {
              if (selectedBotCount >= 2) {
                // Remove Bot 2 (go back to 1 bot)
                setSelectedBotCount(1);
              } else {
                // Add Bot 2
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
                // Remove Bot 3 (go back to 2 bots)
                setSelectedBotCount(2);
              } else {
                // Add Bot 3
                setSelectedBotCount(3);
              }
            }}
          />
        </View>

        {/* Start Button */}
        <Button title="Start" onPress={handleStart} variant="outline" size="lg" fullWidth />

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
