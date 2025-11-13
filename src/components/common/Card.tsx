import { View, TouchableOpacity, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export default function Card({
  children,
  onPress,
  variant = 'default',
  padding = 'md',
  style,
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const variantClasses = {
    default: 'bg-white',
    elevated: 'bg-white shadow-card',
    outlined: 'bg-white border border-neutral-200',
  };

  const baseClasses = `${variantClasses[variant]} ${paddingClasses[padding]} rounded-2xl`;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`${baseClasses} active:opacity-80`}
        style={style}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={baseClasses} style={style}>
      {children}
    </View>
  );
}