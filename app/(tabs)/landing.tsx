import { View, Text, SafeAreaView, StatusBar, Pressable } from 'react-native';
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
import Svg, { Path, Circle } from 'react-native-svg';
import Header from '@/components/common/Header';
import { useAppSelector } from '@/store/hooks';

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
  const user = useAppSelector((state: RootState) => state.user.user);

  // Animation values
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

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

const handlePressIn = () => {
    // Stop idle animation and animate button press
    scale.value = withSpring(0.85, { damping: 15, stiffness: 300 }, () => {
      // scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });

    
  };
  const handlePlayPress = () => {

    // Navigate after a short delay to show animation
    // setTimeout(() => {
      router.push('/mode-selection');
    // }, 200);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header hasNotification />

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
        <Pressable onPressIn={handlePressIn} onPressOut={handlePlayPress} className="items-center">
          <Animated.View style={animatedPlayButton}>
            <PlayIcon />
          </Animated.View>
        </Pressable>
      </View>

      {/* Bottom spacing for tab bar */}
      {/* <View className="h-4" /> */}
    </SafeAreaView>
  );
}
