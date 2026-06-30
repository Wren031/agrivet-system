import { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search products...' }: SearchBarProps) {
  const { colors } = useColorTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      className="flex-row items-center rounded-xl px-4 border"
      style={{
        backgroundColor: colors.surfaceVariant,
        borderColor: focused ? '#059669' : colors.border,
        borderWidth: 1.5,
      }}
    >
      <Search size={18} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 py-3 px-3 text-base text-[#0F172A] dark:text-[#F8FAFC]"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
          <View className="w-5.5 h-5.5 rounded-full bg-[#F1F5F9] dark:bg-[#334155] items-center justify-center" style={{ width: 22, height: 22 }}>
            <X size={14} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
