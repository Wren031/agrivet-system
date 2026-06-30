import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Dimensions } from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

interface SelectOption {
  code: string;
  name: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onSelect: (code: string) => void;
  placeholder?: string;
  error?: string;
}

export function Select({ label, options, value, onSelect, placeholder, error }: SelectProps) {
  const { colors } = useColorTheme();
  const [visible, setVisible] = useState(false);
  const selected = options.find((o) => o.code === value);

  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        className="flex-row items-center rounded-xl border px-4 py-3.5"
        style={{
          backgroundColor: colors.surfaceVariant,
          borderColor: error ? '#DC2626' : colors.border,
          borderWidth: 1.5,
        }}
      >
        <Text className="flex-1 text-base" style={{ color: selected ? colors.text : colors.textTertiary }}>
          {selected ? selected.name : placeholder || 'Select...'}
        </Text>
        <ChevronDown size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      {error && (
        <View className="flex-row items-center mt-1.5 ml-1">
          <View className="w-1 h-1 rounded-full bg-[#DC2626] mr-1.5" />
          <Text className="text-xs text-[#DC2626] font-medium">{error}</Text>
        </View>
      )}

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          className="flex-1 justify-end"
          style={{ backgroundColor: colors.overlay }}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className="rounded-t-3xl pb-9"
            style={{
              backgroundColor: colors.surface,
              maxHeight: Dimensions.get('window').height * 0.6,
            }}
          >
            <View className="flex-row items-center justify-between px-5 py-4.5 border-b border-[#E2E8F0] dark:border-[#334155]">
              <Text className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text className="text-base text-[#059669] dark:text-[#34D399] font-semibold">Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item.code);
                    setVisible(false);
                  }}
                  className="flex-row items-center px-5 py-4"
                  style={{
                    backgroundColor: value === item.code ? '#D1FAE5' : 'transparent',
                  }}
                >
                  <Text
                    className="flex-1 text-base"
                    style={{
                      color: value === item.code ? '#047857' : colors.text,
                      fontWeight: value === item.code ? '600' : '400',
                    }}
                  >
                    {item.name}
                  </Text>
                  {value === item.code && (
                    <View className="w-5.5 h-5.5 rounded-full bg-[#059669] items-center justify-center" style={{ width: 22, height: 22 }}>
                      <ChevronRight size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
