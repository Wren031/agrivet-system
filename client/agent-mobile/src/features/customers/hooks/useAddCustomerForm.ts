import { useState, useEffect, useCallback, useMemo } from "react";
import { addressApi } from "../../../services/addressApi";

interface AddressOption {
  code: string;
  name: string;
}

interface FormData {
  name: string;
  phone: string;
  storeName: string;
  street: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  regionCode: string;
  provinceCode: string;
  cityCode: string;
  barangayCode: string;
}

const initialFormData: FormData = {
  name: "",
  phone: "",
  storeName: "",
  street: "",
  region: "",
  province: "",
  city: "",
  barangay: "",
  regionCode: "",
  provinceCode: "",
  cityCode: "",
  barangayCode: "",
};

export function useAddCustomerForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [regions, setRegions] = useState<AddressOption[]>([]);
  const [provinces, setProvinces] = useState<AddressOption[]>([]);
  const [cities, setCities] = useState<AddressOption[]>([]);
  const [barangays, setBarangays] = useState<AddressOption[]>([]);

  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLoadingRegions(true);
    addressApi
      .getRegions()
      .then((data) =>
        setRegions(data.map((r: any) => ({ code: r.code, name: r.name })))
      )
      .catch(() => {})
      .finally(() => setLoadingRegions(false));
  }, []);

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors]
  );

  const onRegionSelect = useCallback((code: string) => {
    const region = regions.find((r) => r.code === code);
    setFormData((prev) => ({
      ...prev,
      regionCode: code,
      region: region?.name || "",
      provinceCode: "",
      province: "",
      cityCode: "",
      city: "",
      barangayCode: "",
      barangay: "",
    }));
    setProvinces([]);
    setCities([]);
    setBarangays([]);

    if (code) {
      setLoadingProvinces(true);
      addressApi
        .getProvinces(code)
        .then((data) => {
          const mapped = data.map((p: any) => ({
            code: p.code,
            name: p.name,
          }));
          setProvinces(mapped);
          
          if (mapped.length === 0) {
            // Metro Manila/NCR case
            setLoadingCities(true);
            addressApi.getCities(code).then((cityData) => {
              const cityMapped = cityData.map((c: any) => ({
                code: c.code,
                name: c.name,
              }));
              setCities(cityMapped);
            }).finally(() => setLoadingCities(false));
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoadingProvinces(false));
    }
  }, [regions]);

  const onProvinceSelect = useCallback(
    (code: string) => {
      const province = provinces.find((p) => p.code === code);
      setFormData((prev) => ({
        ...prev,
        provinceCode: code,
        province: province?.name || "",
        cityCode: "",
        city: "",
        barangayCode: "",
        barangay: "",
      }));
      setCities([]);
      setBarangays([]);

      if (code) {
        setLoadingCities(true);
        Promise.all([
          addressApi.getMunicipalities(code),
          addressApi.getComponentCities(code),
        ])
          .then(([municipalities, componentCities]) => {
            const combined = [...(municipalities || []), ...(componentCities || [])];
            const mapped = combined.map((c: any) => ({ 
              code: c.code, 
              name: c.name 
            }));
            setCities(mapped);
          })
          .catch((err) => console.log(err))
          .finally(() => setLoadingCities(false));
      }
    },
    [provinces]
  );

  const onCitySelect = useCallback(
    (code: string) => {
      const city = cities.find((c) => c.code === code);
      setFormData((prev) => ({
        ...prev,
        cityCode: code,
        city: city?.name || "",
        barangayCode: "",
        barangay: "",
      }));
      setBarangays([]);

      if (code) {
        setLoadingBarangays(true);
        addressApi
          .getBarangays(code)
          .then((data) =>
            setBarangays(
              data.map((b: any) => ({ code: b.code, name: b.name }))
            )
          )
          .catch((err) => console.log(err))
          .finally(() => setLoadingBarangays(false));
      }
    },
    [cities]
  );

  const onBarangaySelect = useCallback(
    (code: string) => {
      const barangay = barangays.find((b) => b.code === code);
      setFormData((prev) => ({
        ...prev,
        barangayCode: code,
        barangay: barangay?.name || "",
      }));
    },
    [barangays]
  );

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.regionCode) {
      newErrors.region = "Please select a region";
    }
    if (!formData.provinceCode && provinces.length > 0) {
      newErrors.province = "Please select a province";
    }
    if (!formData.cityCode) {
      newErrors.city = "Please select a city/municipality";
    }
    if (!formData.barangayCode) {
      newErrors.barangay = "Please select a barangay";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, provinces]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setProvinces([]);
    setCities([]);
    setBarangays([]);
  }, []);

  const formDataForConfirmation = useMemo(
    () => ({
      name: formData.name,
      phone: formData.phone,
      storeName: formData.storeName,
      address: formData.street,
      region: formData.region,
      province: formData.province,
      city: formData.city,
      barangay: formData.barangay,
    }),
    [formData]
  );

  return {
    formData,
    updateField,
    errors,
    validate,
    resetForm,
    formDataForConfirmation,

    regions,
    provinces,
    cities,
    barangays,

    loadingRegions,
    loadingProvinces,
    loadingCities,
    loadingBarangays,

    onRegionSelect,
    onProvinceSelect,
    onCitySelect,
    onBarangaySelect,
  };
}