import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, CheckSquare } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { FormInput } from '../../../components/inputs/FormInput';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useToast } from '../../../components/modals/Toast';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, LoginFormData } from '../../../utils/validation';

const REMEMBERED_EMAIL_KEY = '@agrivet_remembered_email';
const REMEMBERED_PASSWORD_KEY = '@agrivet_remembered_password';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { login, isLoading, error } = useLogin();
  const { showToast } = useToast();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error]);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    (async () => {
      try {
        const email = await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY);
        const password = await AsyncStorage.getItem(REMEMBERED_PASSWORD_KEY);
        if (email && password) {
          setValue('email', email);
          setValue('password', password);
          setRememberMe(true);
        }
      } catch {}
    })();
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, data.email);
        await AsyncStorage.setItem(REMEMBERED_PASSWORD_KEY, data.password);
      } else {
        await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
        await AsyncStorage.removeItem(REMEMBERED_PASSWORD_KEY);
      }
      await login(data.email, data.password);
    } catch {}
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center py-12">
          <View className="items-center mb-10">
            <Image
              source={require('../../../../assets/1711538445387.jpg')}
              className="w-20 h-20 rounded-2xl mb-6"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Welcome back
            </Text>
            <Text className="text-base text-[#64748B] dark:text-[#94A3B8] mt-2">
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
                secureTextEntry
                error={errors.password?.message}
                icon={<Lock size={18} color={colors.textSecondary} />}
              />
            )}
          />

          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              {rememberMe ? (
                <CheckSquare size={18} color={colors.primary} />
              ) : (
                <View className="w-[18px] h-[18px] rounded border border-[#CBD5E1] dark:border-[#475569]" />
              )}
              <Text className="text-sm text-[#64748B] dark:text-[#94A3B8] ml-2">Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text className="text-sm text-[#059669] dark:text-[#34D399] font-semibold">Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
          />

          <View className="flex-row justify-center mt-8">
            <Text className="text-sm text-[#64748B] dark:text-[#94A3B8]">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-sm text-[#059669] dark:text-[#34D399] font-bold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
