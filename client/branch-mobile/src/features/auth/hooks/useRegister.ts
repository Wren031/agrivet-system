import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../context/AuthContext';
import { authApi } from '../services/auth.service';
import { addressApi } from '../../../services/addressApi';

interface AddressOption {
  code: string;
  name: string;
}

export function useRegister() {
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [idImageUri, setIdImageUri] = useState<string | null>(null);

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
  }, []);

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
        setProvinces([]);
        addressApi.getCities(code).then((c) => {
          setCities(c);
          if (c.length === 1) {
            onCitySelect(c[0].code);
          }
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
    setPurokName(barangay?.name || '');
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Permission to access media library is required');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setIdImageUri(result.assets[0].uri);
      setError(null);
    }
  };

  const buildAddress = () => {
    const parts = [purokName, cityName, provinceName, regionName].filter(Boolean);
    return parts.join(', ');
  };

  const register = async (data: {
    storeName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!idImageUri) throw new Error('Please select your ID image');
      const idVerificationUrl = await authApi.uploadIdImage(idImageUri);
      const address = buildAddress();
      const result = await authRegister(
        data.storeName,
        data.fullName,
        data.email,
        data.phoneNumber,
        data.password,
        idVerificationUrl,
        address
      );
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    } catch (e: any) {
      setError(e.message || 'Registration failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
    idImageUri,
    pickImage,
    regions,
    regionCode,
    regionName,
    onRegionSelect,
    provinces,
    provinceCode,
    provinceName,
    onProvinceSelect,
    cities,
    cityCode,
    cityName,
    onCitySelect,
    barangays,
    purokCode,
    purokName,
    onPurokSelect,
    buildAddress,
  };
}
