import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 justify-center items-center px-8">
      <View className="w-20 h-20 rounded-full bg-[#FEE2E2] dark:bg-[#450A0A] items-center justify-center mb-5">
        <AlertCircle size={36} color="#DC2626" />
      </View>
      <Text className="text-base text-[#0F172A] dark:text-[#F8FAFC] text-center leading-6 mb-5">{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          activeOpacity={0.8}
          className="bg-[#059669] dark:bg-[#34D399] px-7 py-3 rounded-xl"
        >
          <Text className="text-base text-white dark:text-[#052E16] font-bold">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
