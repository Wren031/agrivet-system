import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, Mail, Phone, MapPin, Store, ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { FormInput } from '../../../components/inputs/FormInput';
import { Select } from '../../../components/ui/Select';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useAuth } from '../../../context/AuthContext';
import { profileSchema, ProfileFormData } from '../../../utils/validation';
import { getImageUrl } from '../../../config/api.config';
import { addressApi } from '../../../services/addressApi';
import { settingsFeatureService } from '../services/settingsFeature.service';

interface AddressOption {
  code: string;
  name: string;
}

function Field({ label, value, icon }: { label: string; value?: string; icon: React.ReactNode }) {
  const { colors } = useColorTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceVariant, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ width: 20, marginRight: 10 }}>{icon}</View>
        <Text style={{ fontSize: 15, color: colors.text, flex: 1 }}>{value || '---'}</Text>
      </View>
    </View>
  );
}

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [regions, setRegions] = useState<AddressOption[]>([]);
  const [provinces, setProvinces] = useState<AddressOption[]>([]);
  const [cities, setCities] = useState<AddressOption[]>([]);
  const [barangays, setBarangays] = useState<AddressOption[]>([]);

  const [regionCode, setRegionCode] = useState('');
  const [provinceCode, setProvinceCode] = useState('');
  const [cityCode, setCityCode] = useState('');
  const [purokCode, setPurokCode] = useState('');

  const [regionName, setRegionName] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [cityName, setCityName] = useState('');
  const [purokName, setPurokName] = useState('');

  useEffect(() => {
    addressApi.getRegions().then(setRegions).catch(() => {});
    settingsFeatureService.getProfile()
      .then((branch: any) => {
        const storeName = branch.storeBranch ?? '';
        const fullName = branch.fullName ?? '';
        const email = branch.email ?? '';
        const contactNumber = branch.contactNumber ?? '';
        const address = branch.address ?? '';
        const idVerificationUrl = branch.verificationImage ?? '';
        reset({ storeName, fullName, email, phoneNumber: contactNumber, address });
        updateUser({ storeName, fullName, email, contactNumber, address, idVerificationUrl } as any);
      })
      .catch(() => {});
  }, []);

  const buildAddress = () => {
    const parts = [purokName, cityName, provinceName, regionName].filter(Boolean);
    return parts.join(', ');
  };

  const onRegionSelect = (code: string) => {
    setRegionCode(code);
    setProvinceCode('');
    setCityCode('');
    setPurokCode('');
    setProvinces([]);
    setCities([]);
    setBarangays([]);
    setProvinceName('');
    setCityName('');
    setPurokName('');
    const region = regions.find((r) => r.code === code);
    setRegionName(region?.name || '');
    addressApi.getProvinces(code).then((p) => {
      if (p.length > 0) {
        setProvinces(p);
      } else {
        addressApi.getCities(code).then((c) => {
          setCities(c);
          if (c.length === 1) onCitySelect(c[0].code);
        });
      }
    });
  };

  const onProvinceSelect = (code: string) => {
    setProvinceCode(code);
    setCityCode('');
    setPurokCode('');
    setCities([]);
    setBarangays([]);
    setCityName('');
    setPurokName('');
    const province = provinces.find((p) => p.code === code);
    setProvinceName(province?.name || '');
    Promise.all([
      addressApi.getMunicipalities(code),
      addressApi.getComponentCities(code),
    ]).then(([municipalities, componentCities]) => {
      setCities([...municipalities, ...componentCities]);
    });
  };

  const onCitySelect = (code: string) => {
    setCityCode(code);
    setPurokCode('');
    setBarangays([]);
    setPurokName('');
    const city = cities.find((c) => c.code === code);
    setCityName(city?.name || '');
    addressApi.getBarangays(code).then(setBarangays);
  };

  const onPurokSelect = (code: string) => {
    setPurokCode(code);
    const barangay = barangays.find((b) => b.code === code);
    const name = barangay?.name || '';
    setPurokName(name);
    const parts = [name, cityName, provinceName, regionName].filter(Boolean);
    setValue('address', parts.join(', '));
  };

  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      storeName: user?.storeName || '',
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.contactNumber || '',
      address: user?.address || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        storeBranch: data.storeName,
        fullName: data.fullName,
        email: data.email,
        contactNumber: data.phoneNumber,
        address: data.address,
      };
      await settingsFeatureService.updateProfile(payload as any);
      if (user) {
        await updateUser({ storeName: data.storeName, fullName: data.fullName, email: data.email, contactNumber: data.phoneNumber, address: data.address } as any);
      }
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      storeName: user?.storeName || '',
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.contactNumber || '',
      address: user?.address || '',
    });
    setRegionCode('');
    setProvinceCode('');
    setCityCode('');
    setPurokCode('');
    setRegionName('');
    setProvinceName('');
    setCityName('');
    setPurokName('');
    setProvinces([]);
    setCities([]);
    setBarangays([]);
    setIsEditing(false);
  };

  const verificationImage = getImageUrl(user?.idVerificationUrl ?? undefined);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 48, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, marginLeft: 12 }}>Profile</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=User&background=22C55E&color=fff&size=200' }}
              style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: colors.surfaceVariant }}
            />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 12 }}>{user?.fullName}</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{user?.email}</Text>
        </View>

        {verificationImage && (
          <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 20 }}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Verification ID</Text>
            <Image source={{ uri: verificationImage }} style={{ width: '100%', height: 120, borderRadius: 8, backgroundColor: colors.surfaceVariant }} resizeMode="cover" />
          </View>
        )}

        {!isEditing ? (
          <>
            <Field label="Store / Branch Name" value={user?.storeName} icon={<Store size={16} color={colors.textSecondary} />} />
            <Field label="Full Name" value={user?.fullName} icon={<User size={16} color={colors.textSecondary} />} />
            <Field label="Email" value={user?.email} icon={<Mail size={16} color={colors.textSecondary} />} />
            <Field label="Phone Number" value={user?.contactNumber} icon={<Phone size={16} color={colors.textSecondary} />} />
            <Field label="Address" value={user?.address} icon={<MapPin size={16} color={colors.textSecondary} />} />
          </>
        ) : (
          <>
            <Controller control={control} name="storeName" render={({ field: { onChange, value } }) => (
              <FormInput label="Store / Branch Name" value={value} onChangeText={onChange} placeholder="Enter your store or branch name" autoCapitalize="words" error={errors.storeName?.message} icon={<Store size={18} color={colors.textSecondary} />} />
            )} />
            <Controller control={control} name="fullName" render={({ field: { onChange, value } }) => (
              <FormInput label="Full Name" value={value} onChangeText={onChange} placeholder="Enter your full name" autoCapitalize="words" error={errors.fullName?.message} icon={<User size={18} color={colors.textSecondary} />} />
            )} />
            <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
              <FormInput label="Email" value={value} onChangeText={onChange} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} icon={<Mail size={18} color={colors.textSecondary} />} />
            )} />
            <Controller control={control} name="phoneNumber" render={({ field: { onChange, value } }) => (
              <FormInput label="Phone Number" value={value} onChangeText={onChange} placeholder="Enter your phone number" keyboardType="phone-pad" error={errors.phoneNumber?.message} icon={<Phone size={18} color={colors.textSecondary} />} />
            )} />

            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 14, marginTop: 4 }}>Address</Text>

            <Select label="Region" options={regions} value={regionCode} onSelect={onRegionSelect} placeholder="Select region" />

            {provinces.length > 0 && (
              <Select label="Province" options={provinces} value={provinceCode} onSelect={onProvinceSelect} placeholder="Select province" />
            )}

            {cities.length > 0 && (
              <Select label="City / Municipality" options={cities} value={cityCode} onSelect={onCitySelect} placeholder="Select city" />
            )}

            {barangays.length > 0 && (
              <Select label="Purok / Barangay" options={barangays} value={purokCode} onSelect={onPurokSelect} placeholder="Select purok" />
            )}

            {buildAddress() ? (
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 8, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#F0FDF4', borderRadius: 10 }}>
                <MapPin size={16} color="#059669" style={{ marginTop: 2 }} />
                <Text style={{ fontSize: 13, color: '#059669', fontWeight: '500', flex: 1, lineHeight: 20 }}>{buildAddress()}</Text>
              </View>
            ) : null}
          </>
        )}

        <View style={{ marginTop: 24, gap: 8 }}>
          {!isEditing ? (
            <PrimaryButton title="Edit Profile" onPress={() => setIsEditing(true)} />
          ) : (
            <>
              <PrimaryButton title="Update Profile" onPress={handleSubmit(onSubmit)} loading={isLoading} />
              <TouchableOpacity onPress={handleCancel} disabled={isLoading} style={{ paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
