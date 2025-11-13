import { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { RootState } from '@/store';
import Avatar from '@components/common/Avatar';
import Svg, { Path, Circle } from 'react-native-svg';

// Icons
const WalletIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
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
    {hasNotification && <View className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />}
  </View>
);

const PlayIcon = () => (
  <Svg width={120} height={120} viewBox="0 0 80 80" fill="none">
    <Circle cx="40" cy="40" r="38" stroke="#484848" strokeWidth="2" />
    <Path
      d="M32 26L54 40L32 54V26Z"
      stroke="#484848"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function Landing() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  // Mock data - replace with actual data from state
  const balance = user?.balance || 500;
  const gamesPlayed = user?.stats?.gamesPlayed || 0;

  // Animation values
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);
  const walletScale = useSharedValue(1);

  // Start idle pulse animation on mount
  useFocusEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repeat
      false
    );
  });

  // Animated style for play button
  const animatedPlayButton = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: pulseOpacity.value,
    };
  });

  // Animated style for wallet button
  const animatedWalletButton = useAnimatedStyle(() => {
    return {
      transform: [{ scale: walletScale.value }],
    };
  });

  const handlePlayPress = () => {
    // Stop idle animation and animate button press
    scale.value = withSpring(0.85, { damping: 15, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

    // Navigate after a short delay to show animation
    setTimeout(() => {
      router.push('/(tabs)/mode-selection');
    }, 200);
  };

  const handleWalletPress = () => {
    walletScale.value = withSpring(0.95, { damping: 15, stiffness: 300 }, () => {
      walletScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

    setTimeout(() => {
      router.push('/(tabs)/wallet');
    }, 150);
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleNotificationPress = () => {
    // Handle notification press
    console.log('Notifications pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
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

        {/* Wallet & Notification */}
        <View className="flex-row items-center space-x-3">
          <Pressable onPress={handleWalletPress}>
            <Animated.View
              style={animatedWalletButton}
              className="flex-row items-center space-x-2 gap-2 px-4 py-2 rounded-full border border-neutral-200"
            >
              <WalletIcon />
              <Text className="text-base font-semibold text-neutral-600">₦{balance}</Text>
            </Animated.View>
          </Pressable>

          <TouchableOpacity
            onPress={handleNotificationPress}
            className="w-12 h-12 items-center justify-center active:bg-neutral-50 rounded-full"
          >
            <BellIcon hasNotification />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-8">
        {/* App Title */}
        <Text
          className="text-5xl font-bold text-neutral-900 mb-12"
          style={{
            fontFamily: 'System',
            letterSpacing: -1,
          }}
        >
          Kaji Whot
        </Text>

        {/* Play Button */}
        <Pressable onPress={handlePlayPress} className="items-center">
          <Animated.View style={animatedPlayButton}>
            <PlayIcon />
          </Animated.View>
        </Pressable>
      </View>

      {/* Bottom spacing for tab bar */}
      <View className="h-4" />
    </SafeAreaView>
  );
}
// import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Pressable } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useRouter } from 'expo-router';
// import { RootState } from '@/store';
// import Avatar from '@components/common/Avatar';
// import Svg, { Path, Circle } from 'react-native-svg';
// import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// // Icons
// const WalletIcon = () => (
//   <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
//     <Path
//       d="M21 8H3M21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8M21 8V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V8"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <Circle cx="16" cy="14" r="1.5" fill="currentColor" />
//   </Svg>
// );

// const BellIcon = ({ hasNotification }: { hasNotification?: boolean }) => (
//   <View>
//     <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
//       <Path
//         d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <Path
//         d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </Svg>
//     {hasNotification && <View className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />}
//   </View>
// );

// const Landing = () => {
//   const router = useRouter();
//   const user = useSelector((state: RootState) => state.user.user);
//   // Mock data - replace with actual data from state
//   const balance = user?.balance || 500;
//   const gamesPlayed = user?.stats?.gamesPlayed || 0;

//   const handlePlayPress = () => {
//     router.push('/(tabs)/mode-selection/free');
//   };

//   const handleWalletPress = () => {
//     router.push('/(tabs)/wallet');
//   };

//   const handleProfilePress = () => {
//     router.push('/(tabs)/profile');
//   };

//   const handleNotificationPress = () => {
//     // Handle notification press
//     console.log('Notifications pressed');
//   };

//   const PlayIcon = () => (
//     <Svg width={120} height={120} viewBox="0 0 80 80" fill="none">
//       <Circle cx="40" cy="40" r="38" stroke="#484848" strokeWidth="2" />
//       <Path
//         d="M32 26L54 40L32 54V26Z"
//         stroke="#484848"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </Svg>
//   );
//   const offset = useSharedValue(0);
//   const animatedStyles = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: offset.value }],
//     };
//   });
//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <StatusBar barStyle={'dark-content'} />

//       {/* Header */}
//       <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
//         {/* Profile Section */}
//         <Pressable onPress={handleProfilePress} className="flex-row items-center active:opacity-70">
//           <View className="mr-3">
//             <Avatar source={user?.avatar} username={user?.username} size="lg" />
//           </View>
//           <View>
//             <Text className="text-base font-semibold text-neutral-600">
//               {user?.username || 'username'}
//             </Text>
//             <Text className="text-sm text-neutral-400">{user?.rank || 'rank'}</Text>
//             <Text className="text-xs text-neutral-300">Games: {gamesPlayed}</Text>
//           </View>
//         </Pressable>

//         {/* Wallet & Notification */}
//         <View className="flex-row items-center space-x-3">
//           <TouchableOpacity
//             onPress={handleWalletPress}
//             className="flex-row items-center space-x-2 px-4 py-2 rounded-full border border-neutral-200 active:bg-neutral-50"
//           >
//             <WalletIcon />
//             <Text className="text-base font-semibold text-neutral-600">₦{balance}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={handleNotificationPress}
//             className="w-12 h-12 items-center justify-center active:bg-neutral-50 rounded-full"
//           >
//             <BellIcon hasNotification />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Main Content */}
//       <View className="flex-1 items-center justify-center px-8">
//         {/* App Title */}
//         <Text
//           className="text-5xl font-bold text-neutral-900 mb-12"
//           style={{
//             fontFamily: 'System',
//             letterSpacing: -1,
//           }}
//         >
//           Kaji Whot
//         </Text>

//         {/* Play Button */}
//         <TouchableOpacity onPress={handlePlayPress} activeOpacity={0.7} className="items-center">
//           <Animated.View
//             style={animatedStyles}
//             // className="transform active:scale-75 transition-transform"
//           >
//             <PlayIcon />
//           </Animated.View>
//         </TouchableOpacity>
//       </View>

//       {/* Bottom spacing for tab bar */}
//       <View className="h-4" />
//     </SafeAreaView>
//   );
// };
// export default Landing;
