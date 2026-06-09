import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export function useLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return false;
    }
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      if (result.message === "pending_approval") {
        setError("pending_approval");
        return false;
      }
      setError(result.message);
      return false;
    }
    return true;
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    setError,
    handleLogin,
  };
}
