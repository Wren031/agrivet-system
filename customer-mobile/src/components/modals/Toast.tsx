import { useEffect, createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  message: string;
  type: ToastType;
  id: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons = {
  success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info,
};

const bgColors = {
  success: '#22C55E', error: '#EF4444', warning: '#F59E0B', info: '#3B82F6',
};

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const { colors } = useColorTheme();

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToast({ message, type, id });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const Icon = toast ? icons[toast.type] : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <View
          style={{
            position: 'absolute', top: 60, left: 16, right: 16,
            backgroundColor: bgColors[toast.type],
            borderRadius: 12,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
            zIndex: 9999,
          }}
        >
          {Icon && <Icon size={20} color="#fff" />}
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500', marginLeft: 10, flex: 1 }}>
            {toast.message}
          </Text>
        </View>
      )}
    </ToastContext.Provider>
  );
}
