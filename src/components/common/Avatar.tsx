import { View, Image, Text } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface AvatarProps {
  source?: string | null;
  username?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
  borderColor?: string;
}

const sizeMap = {
  sm: { container: 32, icon: 16, text: 'text-xs' },
  md: { container: 48, icon: 24, text: 'text-base' },
  lg: { container: 64, icon: 32, text: 'text-xl' },
  xl: { container: 96, icon: 48, text: 'text-3xl' },
};

const DefaultAvatarIcon = ({ size }: { size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke="#6A6A6A" strokeWidth="2" />
    <Path
      d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21"
      stroke="#6A6A6A"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default function Avatar({
  source,
  username,
  size = 'md',
  showBorder = false,
  borderColor = '#FF385C',
}: AvatarProps) {
  const { container, icon } = sizeMap[size];

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View
      className="rounded-2xl bg-neutral-100 items-center justify-center"
      style={{
        width: container,
        height: container,
        borderWidth: showBorder ? 2 : 0,
        borderColor: showBorder ? borderColor : 'transparent',
      }}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          className="rounded-2xl"
          style={{ width: container, height: container }}
          resizeMode="cover"
        />
      ) : username ? (
        <Text
          className={`font-bold text-neutral-600 ${sizeMap[size].text}`}
        >
          {getInitials(username)}
        </Text>
      ) : (
        <DefaultAvatarIcon size={icon} />
      )}
    </View>
  );
}