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
    <View className="flex-1 justify-center items-center px-8">
      <View className="w-20 h-20 rounded-full bg-[#F1F5F9] dark:bg-[#334155] items-center justify-center mb-5">
        <Icon size={36} color={colors.textTertiary} />
      </View>
      <Text className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] text-center mb-2">{title}</Text>
      <Text className="text-base text-[#64748B] dark:text-[#94A3B8] text-center leading-6 max-w-[280px]">{message}</Text>
    </View>
  );
}
