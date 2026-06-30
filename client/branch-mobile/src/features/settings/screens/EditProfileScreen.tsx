import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, Mail, Phone, MapPin } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { FormInput } from '../../../components/inputs/FormInput';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useAuthStore } from '../../../store/authStore';
import { profileSchema, ProfileFormData } from '../../../utils/validation';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: (user as any)?.phoneNumber || user?.contactNumber || '',
      address: user?.address || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      if (user) {
        await updateUser({ ...user, ...data });
      }
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 24 }}>Edit Profile</Text>
        <Controller control={control} name="fullName" render={({ field: { onChange, value } }) => (
          <FormInput label="Full Name" value={value} onChangeText={onChange} placeholder="Enter your full name" error={errors.fullName?.message} icon={<User size={18} color={colors.textSecondary} />} />
        )} />
        <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
          <FormInput label="Email" value={value} onChangeText={onChange} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} icon={<Mail size={18} color={colors.textSecondary} />} />
        )} />
        <Controller control={control} name="phoneNumber" render={({ field: { onChange, value } }) => (
          <FormInput label="Phone Number" value={value} onChangeText={onChange} placeholder="Enter your phone number" keyboardType="phone-pad" error={errors.phoneNumber?.message} icon={<Phone size={18} color={colors.textSecondary} />} />
        )} />
        <Controller control={control} name="address" render={({ field: { onChange, value } }) => (
          <FormInput label="Address" value={value} onChangeText={onChange} placeholder="Enter your address" error={errors.address?.message} icon={<MapPin size={18} color={colors.textSecondary} />} />
        )} />
        <PrimaryButton title="Save Changes" onPress={handleSubmit(onSubmit)} loading={isLoading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
