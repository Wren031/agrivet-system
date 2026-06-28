import { View, Text } from 'react-native';
import { Package, ClipboardList, Clock, CheckCircle } from 'lucide-react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Package, ClipboardList, Clock, CheckCircle,
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
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        width: '47%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          width: 44, height: 44, borderRadius: 12,
          backgroundColor: color + '20',
          justifyContent: 'center', alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Icon size={22} color={color} />
      </View>
      <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>{value}</Text>
      <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>{title}</Text>
    </View>
  );
}
