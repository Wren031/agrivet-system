import { useState } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function FormInput({ label, error, icon, ...props }: FormInputProps) {
  const { colors } = useColorTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? '#DC2626' : focused ? '#059669' : colors.border;

  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
        {label}
      </Text>
      <View
        className="flex-row items-center rounded-xl border px-4"
        style={{
          backgroundColor: colors.surfaceVariant,
          borderColor,
          borderWidth: 1.5,
        }}
      >
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 py-3.5 text-[#0F172A] dark:text-[#F8FAFC]"
          {...props}
          style={[{ fontSize: 16 }, props.style]}
        />
      </View>
      {error && (
        <View className="flex-row items-center mt-1.5 ml-1">
          <View className="w-1 h-1 rounded-full bg-[#DC2626] mr-1.5" />
          <Text className="text-xs text-[#DC2626] font-medium">{error}</Text>
        </View>
      )}
    </View>
  );
}
