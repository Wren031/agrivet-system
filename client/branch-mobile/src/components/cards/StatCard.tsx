import { View, Text } from 'react-native';
import { Package, Clock, CheckCircle, ShoppingCart } from 'lucide-react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Package, Clock, CheckCircle, ShoppingCart,
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  const { colors } = useColorTheme();
  const Icon = iconMap[icon] || Package;

  return (
    <View
      style={{
        width: '47%',
        height: 85,
        backgroundColor: colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: color + '14',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '800',
            color: colors.text,
            letterSpacing: -0.5,
            lineHeight: 26,
          }}
        >
          {value}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: colors.textSecondary,
            fontWeight: '500',
            marginTop: 1,
            letterSpacing: 0.2,
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
