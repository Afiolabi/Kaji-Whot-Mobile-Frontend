import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { RootState } from '@/store';
import Avatar from '@components/common/Avatar';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

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
    <Circle cx="16" cy="14" r="1.5" fill="currentColor" />
  </Svg>
);

const CoinsIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    {/* Top coin */}
    <Ellipse cx="12" cy="5" rx="7" ry="3" stroke="#000" strokeWidth="1.5" fill="none" />
    {/* Middle stack */}
    <Path d="M5 5v4c0 1.66 3.13 3 7 3s7-1.34 7-3V5" stroke="#000" strokeWidth="1.5" fill="none" />
    {/* Bottom stack */}
    <Path d="M5 9v4c0 1.66 3.13 3 7 3s7-1.34 7-3V9" stroke="#000" strokeWidth="1.5" fill="none" />
    {/* Base layer */}
    <Path d="M5 13v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4" stroke="#000" strokeWidth="1.5" fill="none" />
  </Svg>
);

const BellIcon = ({ hasNotification }: { hasNotification?: boolean }) => (
  <View>
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
    {hasNotification && (
      <View className="absolute top-[-0.5] right-1 w-2.5 h-2.5 bg-error rounded-full" />
    )}
  </View>
);

interface HeaderProps {
  showWallet?: boolean;
  showCoins?: boolean;
  showNotification?: boolean;
  hasNotification?: boolean;
}

export default function Header({
  showWallet = true,
  showCoins = true,
  showNotification = true,
  hasNotification = false,
}: HeaderProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  const balance = user?.balance || 500;
  const coins = 2000; // Mock coins data
  const gamesPlayed = user?.stats?.gamesPlayed || 0;

  const walletScale = useSharedValue(1);

  const animatedWalletButton = useAnimatedStyle(() => {
    return {
      transform: [{ scale: walletScale.value }],
    };
  });

  const handleWalletPress = () => {
    walletScale.value = withSpring(0.95, { damping: 15, stiffness: 300 }, () => {
      walletScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

    setTimeout(() => {
      router.push('/settings/wallet');
    }, 150);
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/settings/profile');
  };

  const handleNotificationPress = () => {
    // Handle notification press
    console.log('Notifications pressed');
  };

  return (
    <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
      {/* Profile Section */}
      <Pressable onPress={handleProfilePress} className="flex-row items-center active:opacity-70">
        <View className="mr-3">
          <Avatar source={user?.avatar} username={user?.username} size="lg" />
        </View>
        <View>
          <Text className="text-base font-semibold text-neutral-600">
            {user?.username || 'username'}
          </Text>
          <Text className="text-sm text-neutral-400">{user?.rank || 'rank'}</Text>
          <Text className="text-xs text-neutral-300">Games: {gamesPlayed}</Text>
        </View>
      </Pressable>
      <View className="flex-row">
        {/* Wallet, coins & Notification */}
        <Pressable
          onPress={handleWalletPress}
          className="flex-row items-center rounded-full border border-neutral-200"
        >
          {showWallet && (
            <Animated.View
              style={animatedWalletButton}
              className="flex-row items-center gap-1 px-2 py-2 "
            >
              <WalletIcon />
              <Text className="text-m font-semibold text-neutral-600">₦{balance}</Text>
            </Animated.View>
          )}

          {showCoins && (
            <View className="flex-row items-center gap-1 px-2 py-2">
              <CoinsIcon />
              <Text className="text-m font-semibold text-neutral-600">{coins}</Text>
            </View>
          )}
        </Pressable>
        {showNotification && (
          <TouchableOpacity
            onPress={handleNotificationPress}
            className="w-10 h-10 items-center justify-center active:opacity-70"
          >
            <BellIcon hasNotification={hasNotification} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
