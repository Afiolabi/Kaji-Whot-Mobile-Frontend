import { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    {isVisible ? (
      <>
        <Path
          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          stroke="#6A6A6A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12 15a3 3 0 100-6 3 3 0 000 6z"
          stroke="#6A6A6A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <Path
          d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
          stroke="#6A6A6A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M1 1l22 22"
          stroke="#6A6A6A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </Svg>
);

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry,
  containerClassName,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="text-sm font-semibold text-neutral-600 mb-2">
          {label}
        </Text>
      )}
      
      <View
        className={`
          flex-row items-center
          px-4 py-3
          rounded-2xl
          border-2
          ${error ? 'border-error' : isFocused ? 'border-primary' : 'border-neutral-200'}
          ${error ? 'bg-error/5' : 'bg-neutral-50'}
        `}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        
        <TextInput
          className="flex-1 text-base text-neutral-900"
          placeholderTextColor="#B0B0B0"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="ml-3"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <EyeIcon isVisible={isPasswordVisible} />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View className="ml-3">{rightIcon}</View>
        )}
      </View>
      
      {error && (
        <Text className="text-sm text-error mt-1 ml-1">{error}</Text>
      )}
      
      {helperText && !error && (
        <Text className="text-sm text-neutral-400 mt-1 ml-1">{helperText}</Text>
      )}
    </View>
  );
}