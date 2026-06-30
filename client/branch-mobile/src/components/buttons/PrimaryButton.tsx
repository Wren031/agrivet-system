import { useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Animated } from 'react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function PrimaryButton({
  title, onPress, loading, disabled, variant = 'primary',
  size = 'md', icon, fullWidth = true,
}: PrimaryButtonProps) {
  const { colors, isDark } = useColorTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const sizeStyles: Record<string, string> = {
    sm: 'py-2.5 px-4.5',
    md: 'py-3.5 px-6',
    lg: 'py-4 px-7',
  };

  const textSizes: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  const bgClass = isPrimary ? 'bg-[#059669] dark:bg-[#34D399]' :
    isSecondary ? '' :
    isOutline ? 'bg-transparent' : 'bg-[#DC2626]';

  const textClass = isPrimary ? 'text-white dark:text-[#052E16]' :
    variant === 'danger' ? 'text-white' :
    isOutline ? 'text-[#059669] dark:text-[#34D399]' :
    isSecondary ? `text-[${colors.text}]` : 'text-white';

  const bgColor = isPrimary ? colors.primary :
    isSecondary ? colors.surfaceVariant :
    isOutline ? 'transparent' : colors.error;

  const txtColor = isPrimary ? (isDark ? '#052E16' : '#fff') :
    variant === 'danger' ? '#fff' :
    isOutline ? colors.primary :
    isSecondary ? colors.text :
    '#fff';

  return (
    <Animated.View className={`${fullWidth ? 'self-stretch' : 'self-auto'}`} style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`${sizeStyles[size]} rounded-xl flex-row items-center justify-center ${bgClass} ${disabled ? 'opacity-50' : ''}`}
        style={{
          borderWidth: isOutline ? 1.5 : 0,
          borderColor: isOutline ? '#059669' : 'transparent',
          backgroundColor: bgColor,
          shadowColor: isPrimary ? '#059669' : 'transparent',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isPrimary ? 0.3 : 0,
          shadowRadius: 8,
          elevation: isPrimary ? 4 : 0,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={txtColor} />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text className={`${textSizes[size]} font-bold ${textClass}`} style={{ marginLeft: icon ? 10 : 0, letterSpacing: 0.5, color: txtColor }}>
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
