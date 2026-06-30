import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export function useLogin() {
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authLogin(email, password);
      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (e: any) {
      setError(e.message || 'Login failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
