import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export function useRegisterForm() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!fullName || !email || !address || !password) {
      setError("Please fill in all fields");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setLoading(true);
    setError("");
    const result = await register(fullName, email, address, password);
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
