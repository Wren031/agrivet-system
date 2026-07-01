import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

  // --- SUCCESS VIEW ---
  if (isSuccess) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <CheckCircle2 size={40} color="#16A34A" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' }}>Password Changed!</Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 }}>Your password has been updated successfully.</Text>
        </View>
        <View style={{ padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border }}>
          <PrimaryButton title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  // --- INPUT FORM VIEW ---
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // 'padding' is generally best on iOS; Android handles it natively via manifest layout settings
    >
      {/* Header Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 48, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, marginLeft: 12 }}>Change Password</Text>
      </View>

      {/* Form Fields (Scrollable area) */}
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }} // Lowered padding bottom since button isn't floating over it anymore
        keyboardShouldPersistTaps="handled" 
        showsVerticalScrollIndicator={false}
      >
        <Controller control={control} name="currentPassword" render={({ field: { onChange, value } }) => (
          <FormInput label="Current Password" value={value} onChangeText={onChange} placeholder="Enter current password" secureTextEntry error={errors.currentPassword?.message} icon={<Lock size={18} color={colors.textSecondary} />} />
        )} />
        <Controller control={control} name="newPassword" render={({ field: { onChange, value } }) => (
          <FormInput label="New Password" value={value} onChangeText={onChange} placeholder="Enter new password" secureTextEntry error={errors.newPassword?.message} icon={<Lock size={18} color={colors.textSecondary} />} />
        )} />
        <Controller control={control} name="confirmNewPassword" render={({ field: { onChange, value } }) => (
          <FormInput label="Confirm New Password" value={value} onChangeText={onChange} placeholder="Confirm new password" secureTextEntry error={errors.confirmNewPassword?.message} icon={<Lock size={18} color={colors.textSecondary} />} />
        )} />
      </ScrollView>

      {/* Clean Sticky Bottom Button Container */}
      <View style={{ 
        padding: 16, 
        paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Accounting for iOS home indicator bar
        backgroundColor: colors.background, 
        borderTopWidth: 1, 
        borderTopColor: colors.border 
      }}>
        <PrimaryButton title="Change Password" onPress={handleSubmit(onSubmit)} loading={isLoading} />
      </View>
    </KeyboardAvoidingView>
  );
}