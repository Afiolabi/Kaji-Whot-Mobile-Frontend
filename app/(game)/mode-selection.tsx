import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import Header from '@components/common/Header';

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

interface ModeButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  isSelected?: boolean;
}

const ModeButton = ({ title, icon, onPress, isSelected = false }: ModeButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`
        flex-1 aspect-square rounded-3xl items-center justify-center
        border-2 ${isSelected ? 'border-primary' : 'border-neutral-300'}
      `}
      style={{ maxHeight: 100 }}
    >
      <View className="items-center">
        {icon}
        <Text className="text-lg font-semibold text-neutral-900 mt-3">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ModeSelection() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleSelect = (mode: string, route: string) => {
    setSelectedMode(mode);
    router.push(route as unknown as RelativePathString);
  };

  const handleBackPress = () => router.back();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <Header hasNotification />

      <View className="flex-1 px-8 pt-8 justify-center">
        <View className="gap-4">
          {/* Top Row */}
          <View className="flex-row gap-4">
            <ModeButton
              title="Offline (Bot)"
              icon={
                <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                  <Rect x="5" y="7" width="14" height="10" rx="2" stroke="#000" strokeWidth="1.5" />
                  <Circle cx="10" cy="11" r="1" fill="#000" />
                  <Circle cx="14" cy="11" r="1" fill="#000" />
                  <Path d="M9 14h6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                </Svg>
              }
              isSelected={selectedMode === 'offline'}
              onPress={() => handleSelect('offline', '/(game)/select-players?mode=offline')}
            />

            <ModeButton
              title="Free room"
              icon={
                <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="8" r="4" stroke="#000" strokeWidth="1.5" />
                  <Path
                    d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </Svg>
              }
              isSelected={selectedMode === 'free'}
              onPress={() => handleSelect('free', '/(game)/join-create-game?mode=free')}
            />
          </View>

          {/* Bottom Row */}
          <View className="flex-row gap-4">
            <ModeButton
              title="Rank room"
              icon={
                <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 2L14 8L20 9L16 13L17 19L12 16L7 19L8 13L4 9L10 8L12 2Z"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <Circle cx="12" cy="11" r="2" stroke="#000" strokeWidth="1.5" />
                </Svg>
              }
              isSelected={selectedMode === 'rank'}
              onPress={() => handleSelect('rank', '/(game)/select-rank')}
            />

            <ModeButton
              title="Celebrity room"
              icon={
                <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 2L14.5 9L22 9.5L16.5 14.5L18 22L12 18L6 22L7.5 14.5L2 9.5L9.5 9L12 2Z"
                    fill="#000"
                  />
                  <Path
                    d="M12 6L13 10L17 10.5L14 13L15 17L12 15L9 17L10 13L7 10.5L11 10L12 6Z"
                    fill="#fff"
                  />
                </Svg>
              }
              isSelected={selectedMode === 'celebrity'}
              onPress={() => handleSelect('celebrity', '/(game)/join-create-game?mode=celebrity')}
            />
          </View>
        </View>

        {/* Back Button */}
        <View className="items-end top-10">
          <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
            <BackIcon />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
