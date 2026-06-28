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

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceVariant,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Search size={18} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={{
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: 10,
          fontSize: 14,
          color: colors.text,
        }}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <X size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
