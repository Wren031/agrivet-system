import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { authService } from '../services/auth.service';

export function useLogin() {
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      await setUser(result.user, result.token);
    } catch (e: any) {
      setError(e.message || 'Login failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
