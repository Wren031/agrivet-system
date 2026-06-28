import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Clock, Settings } from 'lucide-react-native';

import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../store/themeStore';
import { Colors } from '../constants/colors';

import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import ForgotPasswordScreen from '../features/auth/screens/ForgotPasswordScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import CatalogScreen from '../features/booking/screens/CatalogScreen';
import ProductDetailScreen from '../features/booking/screens/ProductDetailScreen';
import CartScreen from '../features/booking/screens/CartScreen';
import CheckoutScreen from '../features/booking/screens/CheckoutScreen';
import BookingConfirmationScreen from '../features/booking/screens/BookingConfirmationScreen';
import BookingHistoryScreen from '../features/history/screens/BookingHistoryScreen';
import BookingDetailScreen from '../features/history/screens/BookingDetailScreen';
import SettingsScreen from '../features/settings/screens/SettingsScreen';
import EditProfileScreen from '../features/settings/screens/EditProfileScreen';
import ChangePasswordScreen from '../features/settings/screens/ChangePasswordScreen';
import NotificationsScreen from '../features/settings/screens/NotificationsScreen';

import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator();
const BookingStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeDashboard" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

function BookingNavigator() {
  return (
    <BookingStack.Navigator screenOptions={{ headerShown: false }}>
      <BookingStack.Screen name="Catalog" component={CatalogScreen} />
      <BookingStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <BookingStack.Screen name="Cart" component={CartScreen} />
      <BookingStack.Screen name="Checkout" component={CheckoutScreen} />
      <BookingStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    </BookingStack.Navigator>
  );
}

function HistoryNavigator() {
  return (
    <HistoryStack.Navigator screenOptions={{ headerShown: false }}>
      <HistoryStack.Screen name="BookingHistory" component={BookingHistoryScreen} />
      <HistoryStack.Screen name="BookingDetail" component={BookingDetailScreen} />
    </HistoryStack.Navigator>
  );
}

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
      <SettingsStack.Screen name="EditProfile" component={EditProfileScreen} />
      <SettingsStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <SettingsStack.Screen name="Notifications" component={NotificationsScreen} />
    </SettingsStack.Navigator>
  );
}

function MainTabs() {
  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <MainTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <MainTab.Screen
        name="Booking"
        component={BookingNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          tabBarLabel: 'Booking',
        }}
      />
      <MainTab.Screen
        name="History"
        component={HistoryNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
          tabBarLabel: 'History',
        }}
      />
      <MainTab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          tabBarLabel: 'Settings',
        }}
      />
    </MainTab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const systemColorScheme = useColorScheme();
  const { isDark, setDark } = useThemeStore();

  const navTheme = {
    dark: isDark,
    colors: {
      primary: isDark ? Colors.dark.primary : Colors.light.primary,
      background: isDark ? Colors.dark.background : Colors.light.background,
      card: isDark ? Colors.dark.surface : Colors.light.surface,
      text: isDark ? Colors.dark.text : Colors.light.text,
      border: isDark ? Colors.dark.border : Colors.light.border,
      notification: isDark ? Colors.dark.primary : Colors.light.primary,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '900' as const },
    },
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? Colors.dark.background : Colors.light.background }}>
        <ActivityIndicator size="large" color={isDark ? Colors.dark.primary : Colors.light.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
