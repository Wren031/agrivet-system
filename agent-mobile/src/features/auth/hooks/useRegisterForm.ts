import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { authApi } from "../services/authApi";
import { addressApi } from "../../../services/addressApi";
import { useAuth } from "../../../context/AuthContext";

interface AddressOption {
  code: string;
  name: string;
}

export function useRegisterForm() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [idImageUri, setIdImageUri] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const [regions, setRegions] = useState<AddressOption[]>([]);
  const [provinces, setProvinces] = useState<AddressOption[]>([]);
  const [cities, setCities] = useState<AddressOption[]>([]);
  const [barangays, setBarangays] = useState<AddressOption[]>([]);

  const [regionCode, setRegionCode] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [barangayCode, setBarangayCode] = useState("");

  const [regionName, setRegionName] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [cityName, setCityName] = useState("");
  const [barangayName, setBarangayName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    addressApi.getRegions().then(setRegions).catch(() => {});
  }, []);

  const onRegionSelect = (code: string) => {
    setRegionCode(code);
    setProvinceCode("");
    setCityCode("");
    setBarangayCode("");
    setProvinces([]);
    setCities([]);
    setBarangays([]);
    setProvinceName("");
    setCityName("");
    setBarangayName("");
    const region = regions.find((r) => r.code === code);
    setRegionName(region?.name || "");

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
    setCityCode("");
    setBarangayCode("");
    setCities([]);
    setBarangays([]);
    setCityName("");
    setBarangayName("");
    const province = provinces.find((p) => p.code === code);
    setProvinceName(province?.name || "");

    Promise.all([
      addressApi.getMunicipalities(code),
      addressApi.getComponentCities(code),
    ]).then(([municipalities, componentCities]) => {
      setCities([...municipalities, ...componentCities]);
    });
  };

  const onCitySelect = (code: string) => {
    setCityCode(code);
    setBarangayCode("");
    setBarangays([]);
    setBarangayName("");
    const city = cities.find((c) => c.code === code);
    setCityName(city?.name || "");

    addressApi.getBarangays(code).then(setBarangays);
  };

  const onBarangaySelect = (code: string) => {
    setBarangayCode(code);
    const barangay = barangays.find((b) => b.code === code);
    setBarangayName(barangay?.name || "");
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Permission to access media library is required");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setIdImageUri(result.assets[0].uri);
      setError("");
    }
  };

  const buildAddress = () => {
    const parts = [barangayName, cityName, provinceName, regionName].filter(Boolean);
    return parts.join(", ");
  };

  const handleRegister = async () => {
    if (!fullName || !email || !contactNumber || !password) {
      setError("Please fill in all required fields");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!idImageUri) {
      setError("Please select your ID image");
      return false;
    }
    if (!barangayCode) {
      setError("Please complete your address");
      return false;
    }
    setLoading(true);
    setError("");
    try {
      const idVerificationUrl = await authApi.uploadIdImage(idImageUri);
      const address = buildAddress();
      const result = await register(fullName, email, contactNumber, password, idVerificationUrl);
      setLoading(false);
      if (!result.success) {
        setError(result.message);
        return false;
      }
      return true;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Registration failed");
      return false;
    }
  };

  return {
    fullName, setFullName,
    email, setEmail,
    contactNumber, setContactNumber,
    idImageUri, setIdImageUri,
    pickImage,
    password, setPassword,
    loading, error, setError,
    handleRegister,
    regions, regionCode, regionName, onRegionSelect,
    provinces, provinceCode, provinceName, onProvinceSelect,
    cities, cityCode, cityName, onCitySelect,
    barangays, barangayCode, barangayName, onBarangaySelect,
    buildAddress,
  };
}
