
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import Card from '@components/common/Card';

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="#484848"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface ModeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
  badge?: string;
  badgeColor?: string;
}

const ModeCard = ({
  title,
  description,
  icon,
  onPress,
  badge,
  badgeColor = '#00A699',
}: ModeCardProps) => (
  <Card onPress={onPress} variant="elevated" padding="lg">
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <View className="flex-row items-center mb-2">
          <Text className="text-xl font-bold text-neutral-900">{title}</Text>
          {badge && (
            <View
              className="ml-2 px-2 py-1 rounded-full"
              style={{ backgroundColor: badgeColor }}
            >
              <Text className="text-xs font-semibold text-white">{badge}</Text>
            </View>
          )}
        </View>
        <Text className="text-sm text-neutral-500">{description}</Text>
      </View>
      <View className="ml-4">{icon}</View>
    </View>
  </Card>
);

export default function PlayModeSelection() {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleFreeMode = () => {
    router.push('/(tabs)/mode-selection/free');
  };

  const handleRankMode = () => {
    router.push('/(tabs)/mode-selection/rank');
  };

  const handleCelebrityMode = () => {
    router.push('/(tabs)/mode-selection/celebrity');
  };

  const handleOfflineMode = () => {
    router.push('/(tabs)/mode-selection/offline');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-neutral-100">
        <TouchableOpacity
          onPress={handleBackPress}
          className="w-10 h-10 items-center justify-center active:bg-neutral-100 rounded-full"
        >
          <BackIcon />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-neutral-900 ml-3">
          Choose Game Mode
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Free Room */}
        <View className="mb-4">
          <ModeCard
            title="Free Room"
            description="Play casual games with no entry fee"
            icon={
              <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                <Circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#00A699"
                  strokeWidth="2"
                />
                <Path
                  d="M12 6v6l4 2"
                  stroke="#00A699"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            }
            onPress={handleFreeMode}
            badge="FREE"
            badgeColor="#00A699"
          />
        </View>

        {/* Rank Room */}
        <View className="mb-4">
          <ModeCard
            title="Rank Room"
            description="Compete for money in tiered matches"
            icon={
              <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="#FFB400"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            }
            onPress={handleRankMode}
            badge="₦50 - ₦200"
            badgeColor="#FFB400"
          />
        </View>

        {/* Celebrity Room */}
        <View className="mb-4">
          <ModeCard
            title="Celebrity Room"
            description="Play with verified celebrities and win big"
            icon={
              <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                  stroke="#FF385C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="#FF385C"
                  strokeWidth="2"
                />
                <Path
                  d="M17 11l2-2 2 2"
                  stroke="#FF385C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            }
            onPress={handleCelebrityMode}
            badge="VIP"
            badgeColor="#FF385C"
          />
        </View>

        {/* Offline Bot */}
        <View className="mb-4">
          <ModeCard
            title="Offline (Bot)"
            description="Practice against AI opponents"
            icon={
              <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                <Rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="#6A6A6A"
                  strokeWidth="2"
                />
                <Path
                  d="M8 10h.01M16 10h.01M8 14h8"
                  stroke="#6A6A6A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            }
            onPress={handleOfflineMode}
            badge="PRACTICE"
            badgeColor="#6A6A6A"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}