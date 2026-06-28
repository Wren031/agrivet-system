import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, User, Phone } from 'lucide-react-native';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { FormInput } from '../../../components/inputs/FormInput';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useToast } from '../../../components/modals/Toast';
import { useRegister } from '../hooks/useRegister';
import { registerSchema, RegisterFormData } from '../../../utils/validation';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { register, isLoading, error } = useRegister();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error]);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
    } catch {}
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
        <View style={{ marginBottom: 30, marginTop: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Create Account</Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6 }}>
            Sign up to get started
          </Text>
        </View>

        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <FormInput label="Full Name" value={value} onChangeText={onChange} placeholder="Enter your full name"
              autoCapitalize="words" error={errors.fullName?.message} icon={<User size={18} color={colors.textSecondary} />} />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <FormInput label="Email" value={value} onChangeText={onChange} placeholder="Enter your email"
              keyboardType="email-address" autoCapitalize="none" error={errors.email?.message}
              icon={<Mail size={18} color={colors.textSecondary} />} />
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <FormInput label="Phone Number" value={value} onChangeText={onChange} placeholder="Enter your phone number"
              keyboardType="phone-pad" error={errors.phoneNumber?.message} icon={<Phone size={18} color={colors.textSecondary} />} />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <FormInput label="Password" value={value} onChangeText={onChange} placeholder="Create a password"
              secureTextEntry error={errors.password?.message} icon={<Lock size={18} color={colors.textSecondary} />} />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <FormInput label="Confirm Password" value={value} onChangeText={onChange} placeholder="Confirm your password"
              secureTextEntry error={errors.confirmPassword?.message} icon={<Lock size={18} color={colors.textSecondary} />} />
          )}
        />

        <PrimaryButton title="Create Account" onPress={handleSubmit(onSubmit)} loading={isLoading} />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 30 }}>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '700' }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
