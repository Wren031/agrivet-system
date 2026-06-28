import { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { authService } from '../services/auth.service';

export function useRegister() {
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: { fullName: string; email: string; phoneNumber: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.register(data);
      await setUser(result.user, result.token);
    } catch (e: any) {
      setError(e.message || 'Registration failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
