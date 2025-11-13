import { View, Text } from 'react-native';

interface BadgeProps {
  count?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  children?: React.ReactNode;
}

export default function Badge({
  count,
  variant = 'error',
  size = 'sm',
  dot = false,
  children,
}: BadgeProps) {
  const variantColors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  if (dot) {
    return (
      <View className={`${variantColors[variant]} ${sizeClasses[size]} rounded-full`} />
    );
  }

  if (children) {
    return (
      <View className={`${variantColors[variant]} px-2 py-1 rounded-full`}>
        {children}
      </View>
    );
  }

  if (count !== undefined && count > 0) {
    return (
      <View
        className={`
          ${variantColors[variant]} 
          ${sizeClasses[size]}
          rounded-full
          items-center
          justify-center
          min-w-[20px]
          px-1
        `}
      >
        <Text className={`${textSizeClasses[size]} text-white font-bold`}>
          {count > 99 ? '99+' : count}
        </Text>
      </View>
    );
  }

  return null;
}