import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export function useRegisterForm() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [idVerificationUrl, setIdVerificationUrl] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!fullName || !email || !contactNumber || !password) {
      setError("Please fill in all required fields");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setLoading(true);
    setError("");
    const result = await register(fullName, email, contactNumber, password, idVerificationUrl || undefined);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return false;
    }
    return true;
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    contactNumber,
    setContactNumber,
    idVerificationUrl,
    setIdVerificationUrl,
    address,
    setAddress,
    password,
    setPassword,
    loading,
    error,
    setError,
    handleRegister,
  };
}
