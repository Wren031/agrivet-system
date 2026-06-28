import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function FormInput({ label, error, icon, ...props }: FormInputProps) {
  const { colors } = useColorTheme();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surfaceVariant,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: error ? colors.error : colors.border,
          paddingHorizontal: 14,
        }}
      >
        {icon && <View style={{ marginRight: 10 }}>{icon}</View>}
        <TextInput
          placeholderTextColor={colors.textTertiary}
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 15,
            color: colors.text,
          }}
          {...props}
        />
      </View>
      {error && (
        <Text style={{ fontSize: 12, color: colors.error, marginTop: 4, marginLeft: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
