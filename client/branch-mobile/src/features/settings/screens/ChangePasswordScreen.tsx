import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { FormInput } from '../../../components/inputs/FormInput';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { changePasswordSchema, ChangePasswordFormData } from '../../../utils/validation';

export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' }}>Password Changed!</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8 }}>Your password has been updated successfully.</Text>
        <View style={{ marginTop: 24, width: '100%' }}>
          <PrimaryButton title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 24 }}>Change Password</Text>
        <Controller control={control} name="currentPassword" render={({ field: { onChange, value } }) => (
          <FormInput label="Current Password" value={value} onChangeText={onChange} placeholder="Enter current password" secureTextEntry error={errors.currentPassword?.message} icon={<Lock size={18} color={colors.textSecondary} />} />
        )} />
        <Controller control={control} name="newPassword" render={({ field: { onChange, value } }) => (
          <FormInput label="New Password" value={value} onChangeText={onChange} placeholder="Enter new password" secureTextEntry error={errors.newPassword?.message} icon={<Lock size={18} color={colors.textSecondary} />} />
        )} />
        <Controller control={control} name="confirmNewPassword" render={({ field: { onChange, value } }) => (
          <FormInput label="Confirm New Password" value={value} onChangeText={onChange} placeholder="Confirm new password" secureTextEntry error={errors.confirmNewPassword?.message} icon={<Lock size={18} color={colors.textSecondary} />} />
        )} />
        <PrimaryButton title="Change Password" onPress={handleSubmit(onSubmit)} loading={isLoading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
