import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { FormInput } from '../../../components/inputs/FormInput';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../../utils/validation';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { sendResetLink, isLoading, isSuccess } = useForgotPassword();

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await sendResetLink(data.email);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, marginBottom: 30, width: 40, height: 40, justifyContent: 'center' }}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Forgot Password</Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6 }}>
            Enter your email and we'll send you a reset link
          </Text>
        </View>

        {isSuccess ? (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <CheckCircle size={64} color={colors.success} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 16, textAlign: 'center' }}>
              Reset Link Sent!
            </Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8, textAlign: 'center', lineHeight: 20 }}>
              Please check your email for the password reset link.
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 24 }}>
              <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '700' }}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <FormInput label="Email" value={value} onChangeText={onChange} placeholder="Enter your email"
                  keyboardType="email-address" autoCapitalize="none" error={errors.email?.message}
                  icon={<Mail size={18} color={colors.textSecondary} />} />
              )}
            />
            <PrimaryButton title="Send Reset Link" onPress={handleSubmit(onSubmit)} loading={isLoading} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
