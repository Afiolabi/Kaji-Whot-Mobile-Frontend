import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { Card } from '@/types/card.types';

interface GameCardProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  card,
  size = 'md',
  onPress,
  disabled = false,
  selected = false,
}) => {
  const sizeClasses = {
    sm: { container: 'w-14 h-20', icon: 32, text: 'text-[10px]' },
    md: { container: 'w-20 h-32', icon: 48, text: 'text-xs' },
    lg: { container: 'w-24 h-36', icon: 56, text: 'text-sm' },
  };

  const shapeIcons = {
    star: (size: number) => (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 2L14.5 9L22 9.5L16.5 14.5L18 22L12 18L6 22L7.5 14.5L2 9.5L9.5 9L12 2Z"
          fill="#000"
        />
      </Svg>
    ),
    circle: (size: number) => (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10" fill="#000" />
      </Svg>
    ),
    triangle: (size: number) => (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Polygon points="12,3 22,21 2,21" fill="#000" />
      </Svg>
    ),
    cross: (size: number) => (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 2L14 10H22L16 15L18 23L12 18L6 23L8 15L2 10H10L12 2Z"
          fill="#000"
          transform="rotate(45 12 12)"
        />
      </Svg>
    ),
    square: (size: number) => (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect x="4" y="4" width="16" height="16" fill="#000" />
      </Svg>
    ),
    whot: (size: number) => (
      <View className="items-center">
        <Text className="text-2xl font-bold">W</Text>
      </View>
    ),
  };

  const { container, icon, text } = sizeClasses[size];

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
      className={`${container} ${selected ? '-translate-y-4' : ''} ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <View className="flex-1 bg-white rounded-lg border-2 border-neutral-900 items-center justify-center p-2">
        {/* Card Number (Top Left) */}
        <Text className={`absolute top-1 left-1 ${text} font-bold`}>
          {card.number === 20 ? 'W' : card.number}
        </Text>

        {/* Small shape icon (Top Left) */}
        <View className="absolute top-0.5 left-5">
          {shapeIcons[card.shape](12)}
        </View>

        {/* Card Shape Icon (Center) */}
        <View className="items-center justify-center">{shapeIcons[card.shape](icon)}</View>

        {/* Card Number (Bottom Right - Rotated) */}
        <View className="absolute bottom-1 right-1 rotate-180">
          <Text className={`${text} font-bold`}>
            {card.number === 20 ? 'W' : card.number}
          </Text>
        </View>

        {/* Small shape icon (Bottom Right - Rotated) */}
        <View className="absolute bottom-0.5 right-5 rotate-180">
          {shapeIcons[card.shape](12)}
        </View>

        {/* Special Card Indicator */}
        {card.isSpecial && (
          <View className="absolute top-1 right-1 bg-warning rounded-full w-4 h-4 items-center justify-center">
            <Text className="text-[8px] text-white font-bold">★</Text>
          </View>
        )}
      </View>
    </Wrapper>
  );
};

export default GameCard;