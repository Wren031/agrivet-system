import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { colors } = useColorTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <AlertCircle size={64} color={colors.error} />
      <Text style={{ fontSize: 16, color: colors.text, marginTop: 16, textAlign: 'center', lineHeight: 22 }}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
