import { useState } from 'react';
import { authService } from '../services/auth.service';

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendResetLink = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
    } catch (e: any) {
      setError(e.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return { sendResetLink, isLoading, isSuccess, error };
}
