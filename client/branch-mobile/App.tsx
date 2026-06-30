import './global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { ToastProvider } from './src/components/modals/Toast';
import { AuthProvider } from './src/context/AuthContext';
import { useThemeStore } from './src/store/themeStore';

export default function App() {
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <AppNavigator />
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
