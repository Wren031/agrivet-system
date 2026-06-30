import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, User, Phone, Store, Camera, CheckCircle2, ArrowLeft, Info, Upload } from 'lucide-react-native';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { FormInput } from '../../../components/inputs/FormInput';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../components/modals/Toast';
import { useRegister } from '../hooks/useRegister';
import { registerSchema, RegisterFormData } from '../../../utils/validation';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const [showApproval, setShowApproval] = useState(false);
  const [showIDGuide, setShowIDGuide] = useState(false);
  const {
    register,
    isLoading,
    error,
    idImageUri,
    pickImage,
    regions,
    regionCode,
    onRegionSelect,
    provinces,
    provinceCode,
    onProvinceSelect,
    cities,
    cityCode,
    onCitySelect,
    barangays,
    purokCode,
    onPurokSelect,
  } = useRegister();
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error]);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      storeName: '', fullName: '', email: '', phoneNumber: '',
      password: '', confirmPassword: '',
      regionCode: '', provinceCode: '', cityCode: '', purokCode: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await register({
        storeName: data.storeName,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      if (result?.message === 'pending_approval') {
        setShowApproval(true);
      }
    } catch {}
  };

  if (showApproval) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A]">
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 rounded-full bg-[#DCFCE7] dark:bg-[#052E16] items-center justify-center mb-7">
            <CheckCircle2 size={48} color="#16A34A" />
          </View>
          <Text className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] text-center">
            Registration successful!
          </Text>
          <View className="rounded-xl p-4 mt-6 mb-8 w-full border border-[#D97706]/30 bg-[#FEF3C7] dark:bg-[#451A03]">
            <Text className="text-sm text-[#D97706] dark:text-[#FDE68A] text-center font-medium leading-6">
              Your account is pending approval from an administrator. You will be able to log in once your account has been reviewed.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            className="rounded-xl px-8 py-3.5 bg-[#059669] dark:bg-[#34D399]"
          >
            <Text className="text-sm text-white dark:text-[#052E16] font-bold">Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : undefined}
    >
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-xl items-center justify-center mb-3"
          activeOpacity={0.7}
          style={{
            backgroundColor: colors.surfaceVariant,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <View className="items-center mb-6">
          <Image
            source={require('../../../../assets/1711538445387.jpg')}
            className="w-20 h-20 rounded-2xl mb-4"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Create account
          </Text>
          <Text className="text-base text-[#64748B] dark:text-[#94A3B8] mt-2">
            Fill in your details to get started
          </Text>
        </View>

        <Controller
          control={control}
          name="storeName"
          render={({ field: { onChange, value } }) => (
            <FormInput label="Store Name" value={value} onChangeText={onChange} placeholder="Enter your store name"
              autoCapitalize="words" error={errors.storeName?.message} icon={<Store size={18} color={colors.textSecondary} />} />
          )}
        />
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

        <TouchableOpacity
          onPress={() => setShowIDGuide(true)}
          activeOpacity={0.7}
          className="border-2 border-dashed rounded-xl items-center justify-center self-stretch mb-5 overflow-hidden"
          style={{
            borderColor: idImageUri ? colors.primary : colors.border,
            backgroundColor: idImageUri ? '#D1FAE5' : colors.surfaceVariant,
          }}
        >
          {idImageUri ? (
            <View className="w-full">
              <Image source={{ uri: idImageUri }} className="w-full" style={{ height: 176 }} resizeMode="cover" />
              <View className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-black/55">
                <Text className="text-white text-sm text-center font-semibold">Tap to change image</Text>
              </View>
            </View>
          ) : (
            <View className="items-center py-10">
              <View className="w-14 h-14 rounded-full items-center justify-center mb-3 bg-[#059669]/15">
                <Camera size={24} color="#059669" />
              </View>
              <Text className="text-base text-[#64748B] dark:text-[#94A3B8] font-semibold">Upload Government ID</Text>
              <Text className="text-sm text-[#94A3B8] dark:text-[#64748B] mt-1">JPG, PNG or WEBP</Text>
            </View>
          )}
        </TouchableOpacity>

        <Modal visible={showIDGuide} transparent animationType="fade">
          <View className="flex-1 justify-center px-6" style={{ backgroundColor: colors.overlay }}>
            <View
              className="rounded-2xl p-6"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="items-center mb-5">
                <View className="w-14 h-14 rounded-full bg-[#DBEAFE] dark:bg-[#1E3A5F] items-center justify-center mb-3">
                  <Info size={28} color="#3B82F6" />
                </View>
                <Text className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">ID Verification</Text>
              </View>

              <Text className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-6">
                Please upload a clear photo of any valid government-issued ID. Make sure all details (name, photo, ID number) are visible and not blurred.
              </Text>

              <Text className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mt-4 mb-2">Accepted IDs:</Text>
              <View className="rounded-xl p-3.5 bg-[#F8FAFC] dark:bg-[#1E293B]">
                <Text className="text-sm text-[#475569] dark:text-[#CBD5E1] leading-7">
                  • Passport{'\n'}• Driver's License{'\n'}• UMID / SSS ID{'\n'}• PhilHealth ID{'\n'}• National ID (PhilSys ID)
                </Text>
              </View>

              <View className="flex-row mt-6">
                <TouchableOpacity
                  onPress={() => setShowIDGuide(false)}
                  className="flex-1 rounded-xl py-3.5 items-center justify-center"
                  activeOpacity={0.7}
                  style={{ backgroundColor: colors.surfaceVariant }}
                >
                  <Text className="text-base font-bold text-[#64748B] dark:text-[#94A3B8]">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowIDGuide(false);
                    pickImage();
                  }}
                  className="flex-1 rounded-xl py-3.5 flex-row items-center justify-center ml-3 bg-[#059669] dark:bg-[#34D399]"
                  activeOpacity={0.8}
                >
                  <Upload size={18} color="#fff" />
                  <Text className="text-base font-bold text-white dark:text-[#052E16] ml-2">Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Select
          label="Region"
          options={regions}
          value={regionCode}
          onSelect={(code) => {
            onRegionSelect(code);
            setValue('regionCode', code);
            setValue('provinceCode', '');
            setValue('cityCode', '');
            setValue('purokCode', '');
          }}
          placeholder="Select region"
          error={errors.regionCode?.message}
        />

        {provinces.length > 0 && (
          <Select
            label="Province"
            options={provinces}
            value={provinceCode}
            onSelect={(code) => {
              onProvinceSelect(code);
              setValue('provinceCode', code);
              setValue('cityCode', '');
              setValue('purokCode', '');
            }}
            placeholder="Select province"
            error={errors.provinceCode?.message}
          />
        )}

        {cities.length > 0 && (
          <Select
            label="City / Municipality"
            options={cities}
            value={cityCode}
            onSelect={(code) => {
              onCitySelect(code);
              setValue('cityCode', code);
              setValue('purokCode', '');
            }}
            placeholder="Select city"
            error={errors.cityCode?.message}
          />
        )}

        {barangays.length > 0 && (
          <Select
            label="Purok / Barangay"
            options={barangays}
            value={purokCode}
            onSelect={(code) => {
              onPurokSelect(code);
              setValue('purokCode', code);
            }}
            placeholder="Select purok"
            error={errors.purokCode?.message}
          />
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <FormInput label="Password" value={value} onChangeText={onChange} placeholder="Minimum 6 characters"
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

        <View className="mt-2">
          <PrimaryButton title="Create Account" onPress={handleSubmit(onSubmit)} loading={isLoading} />
        </View>

        <View className="mt-5 rounded-xl p-4 bg-[#DBEAFE] dark:bg-[#172554] border border-[#2563EB]/20">
          <Text className="text-sm text-[#2563EB] dark:text-[#93C5FD] font-semibold leading-6">
            New accounts require admin approval before you can access the application.
          </Text>
        </View>

        <View className="flex-row justify-center mt-8 mb-4">
          <Text className="text-base text-[#64748B] dark:text-[#94A3B8]">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-base text-[#059669] dark:text-[#34D399] font-bold">Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
