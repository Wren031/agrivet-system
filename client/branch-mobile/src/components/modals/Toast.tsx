import { useEffect, createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react-native';

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

const config = {
  success: { icon: CheckCircle, bg: '#F0FDF4', border: '#86EFAC', text: '#166534', iconColor: '#16A34A' },
  error: { icon: XCircle, bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', iconColor: '#DC2626' },
  warning: { icon: AlertTriangle, bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', iconColor: '#D97706' },
  info: { icon: Info, bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', iconColor: '#2563EB' },
};

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToast({ message, type, id });
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, []);

  const dismissToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const cfg = toast ? config[toast.type] : config.info;
  const Icon = cfg.icon;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          className="absolute top-[54px] left-4 right-4 rounded-xl border p-3.5 flex-row items-center z-[9999]"
          style={{
            backgroundColor: cfg.bg,
            borderColor: cfg.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 8,
            opacity,
            transform: [{ translateY }],
          }}
        >
          <Icon size={20} color={cfg.iconColor} />
          <Text className="text-sm font-semibold flex-1 leading-5 ml-3" style={{ color: cfg.text }}>
            {toast.message}
          </Text>
          <TouchableOpacity onPress={dismissToast} className="ml-2">
            <X size={18} color={cfg.text} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}
