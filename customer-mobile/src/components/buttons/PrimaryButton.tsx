import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
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
  const { colors } = useColorTheme();

  const sizeStyles = {
    sm: { py: 8, px: 16, fontSize: 13 },
    md: { py: 12, px: 20, fontSize: 15 },
    lg: { py: 14, px: 24, fontSize: 16 },
  };

  const s = sizeStyles[size];
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  const bgColor = isPrimary ? colors.primary : isDanger ? colors.error : isOutline ? 'transparent' : colors.surfaceVariant;
  const textColor = isPrimary || isDanger ? '#FFFFFF' : isOutline ? colors.primary : colors.text;
  const borderColor = isOutline ? colors.primary : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={{
        backgroundColor: bgColor,
        paddingVertical: s.py,
        paddingHorizontal: s.px,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: fullWidth ? 'stretch' : 'auto',
        opacity: disabled ? 0.5 : 1,
        borderWidth: isOutline ? 1.5 : 0,
        borderColor,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={{
              color: textColor,
              fontSize: s.fontSize,
              fontWeight: '700',
              marginLeft: icon ? 8 : 0,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
