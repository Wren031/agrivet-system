import { View, Text } from 'react-native';
import { Package } from 'lucide-react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ComponentType<{ size: number; color: string }>;
}

export function EmptyState({ title, message, icon: Icon = Package }: EmptyStateProps) {
  const { colors } = useColorTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <Icon size={64} color={colors.textTertiary} />
      <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginTop: 16, textAlign: 'center' }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8, textAlign: 'center', lineHeight: 20 }}>
        {message}
      </Text>
    </View>
  );
}
