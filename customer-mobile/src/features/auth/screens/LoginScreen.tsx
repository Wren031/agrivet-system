import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock } from 'lucide-react-native';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { FormInput } from '../../../components/inputs/FormInput';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useToast } from '../../../components/modals/Toast';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, LoginFormData } from '../../../utils/validation';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { login, isLoading, error } = useLogin();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error]);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch {}
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View
            style={{
              width: 80, height: 80, borderRadius: 20,
              backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 32, fontWeight: '900', color: '#fff' }}>A</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Welcome Back</Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6 }}>
            Sign in to your account
          </Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Email"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
              icon={<Mail size={18} color={colors.textSecondary} />}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Password"
              value={value}
              onChangeText={onChange}
              placeholder="Enter your password"
              secureTextEntry={true}
              error={errors.password?.message}
              icon={<Lock size={18} color={colors.textSecondary} />}
            />
          )}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
          <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '600' }}>Forgot Password?</Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '700' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
