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
  const btnSize = size === 'sm' ? 28 : 36;
  const fontSize = size === 'sm' ? 14 : 16;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={onDecrease}
        disabled={quantity <= min}
        style={{
          width: btnSize, height: btnSize, borderRadius: btnSize / 2,
          backgroundColor: quantity <= min ? colors.surfaceVariant : colors.primary + '20',
          justifyContent: 'center', alignItems: 'center',
        }}
      >
        <Minus size={size === 'sm' ? 14 : 16} color={quantity <= min ? colors.textTertiary : colors.primary} />
      </TouchableOpacity>
      <Text style={{ fontSize, fontWeight: '700', color: colors.text, marginHorizontal: 16, minWidth: 24, textAlign: 'center' }}>
        {quantity}
      </Text>
      <TouchableOpacity
        onPress={onIncrease}
        disabled={quantity >= max}
        style={{
          width: btnSize, height: btnSize, borderRadius: btnSize / 2,
          backgroundColor: quantity >= max ? colors.surfaceVariant : colors.primary + '20',
          justifyContent: 'center', alignItems: 'center',
        }}
      >
        <Plus size={size === 'sm' ? 14 : 16} color={quantity >= max ? colors.textTertiary : colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
