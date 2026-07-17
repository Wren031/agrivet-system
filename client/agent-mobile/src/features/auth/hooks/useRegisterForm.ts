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

  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  useEffect(() => {
    setLoadingRegions(true);
    addressApi.getRegions().then((data) => {
      setRegions(data.map((r: any) => ({ code: r.code, name: r.name })));
    }).catch(() => {}).finally(() => setLoadingRegions(false));
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

    if (code) {
      setLoadingProvinces(true);
      addressApi.getProvinces(code).then((p) => {
        const mapped = p.map((prov: any) => ({ code: prov.code, name: prov.name }));
        setProvinces(mapped);
        if (mapped.length === 0) {
          addressApi.getCities(code).then((c) => {
            setCities(c.map((city: any) => ({ code: city.code, name: city.name })));
          });
        }
      }).finally(() => setLoadingProvinces(false));
    }
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

    if (code) {
      setLoadingCities(true);
      Promise.all([
        addressApi.getMunicipalities(code),
        addressApi.getComponentCities(code),
      ]).then(([municipalities, componentCities]) => {
        setCities(
          [...municipalities, ...componentCities].map((c: any) => ({
            code: c.code,
            name: c.name,
          }))
        );
      }).finally(() => setLoadingCities(false));
    }
  };

  const onCitySelect = (code: string) => {
    setCityCode(code);
    setBarangayCode("");
    setBarangays([]);
    setBarangayName("");
    const city = cities.find((c) => c.code === code);
    setCityName(city?.name || "");

    if (code) {
      setLoadingBarangays(true);
      addressApi.getBarangays(code).then((data) => {
        setBarangays(data.map((b: any) => ({ code: b.code, name: b.name })));
      }).finally(() => setLoadingBarangays(false));
    }
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
      return { success: false, message: "Please fill in all required fields" };
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return { success: false, message: "Password must be at least 6 characters" };
    }
    if (!idImageUri) {
      setError("Please select your ID image");
      return { success: false, message: "Please select your ID image" };
    }
    if (!barangayCode) {
      setError("Please complete your address");
      return { success: false, message: "Please complete your address" };
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
        return result;
      }
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Registration failed");
      return { success: false, message: err.message || "Registration failed" };
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
    loadingRegions, loadingProvinces, loadingCities, loadingBarangays,
  };
}
