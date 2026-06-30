import { View, Text, TouchableOpacity } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export function QuantitySelector({ quantity, onIncrease, onDecrease, min = 1, max = 99, size = 'md' }: QuantitySelectorProps) {
  const { colors } = useColorTheme();
  const btnSize = size === 'sm' ? 32 : 40;
  const iconSize = size === 'sm' ? 16 : 18;
  const fontSize = size === 'sm' ? 'text-base' : 'text-lg';
  const gap = size === 'sm' ? 12 : 16;

  const isMin = quantity <= min;
  const isMax = quantity >= max;

  return (
    <View className="flex-row items-center">
      <TouchableOpacity
        onPress={onDecrease}
        disabled={isMin}
        activeOpacity={0.7}
        className="items-center justify-center border rounded-lg"
        style={{
          width: btnSize, height: btnSize,
          backgroundColor: isMin ? colors.surfaceVariant : '#D1FAE5',
          borderColor: isMin ? colors.border : '#059669/30',
        }}
      >
        <Minus size={iconSize} color={isMin ? colors.textTertiary : '#059669'} />
      </TouchableOpacity>
      <Text
        className={`${fontSize} font-bold text-[#0F172A] dark:text-[#F8FAFC] text-center`}
        style={{ marginHorizontal: gap, minWidth: 32 }}
      >
        {quantity}
      </Text>
      <TouchableOpacity
        onPress={onIncrease}
        disabled={isMax}
        activeOpacity={0.7}
        className="items-center justify-center border rounded-lg"
        style={{
          width: btnSize, height: btnSize,
          backgroundColor: isMax ? colors.surfaceVariant : '#D1FAE5',
          borderColor: isMax ? colors.border : '#059669/30',
        }}
      >
        <Plus size={iconSize} color={isMax ? colors.textTertiary : '#059669'} />
      </TouchableOpacity>
    </View>
  );
}
