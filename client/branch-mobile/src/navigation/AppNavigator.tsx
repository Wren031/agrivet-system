import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from './CustomTabBar';

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
import FavoritesScreen from '../features/favorites/screens/FavoritesScreen';
import BranchesScreen from '../features/booking/screens/BranchesScreen';
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
const FavoritesStack = createNativeStackNavigator();
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
    </BookingStack.Navigator>
  );
}

function FavoritesNavigator() {
  return (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritesStack.Screen name="FavoritesMain" component={FavoritesScreen} />
    </FavoritesStack.Navigator>
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
  return (
    <MainTab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <MainTab.Screen
        name="Home"
        component={HomeNavigator}
      />
      <MainTab.Screen
        name="Items"
        component={BookingNavigator}
      />
      <MainTab.Screen
        name="Favorites"
        component={FavoritesNavigator}
      />
      <MainTab.Screen
        name="History"
        component={HistoryNavigator}
      />
      <MainTab.Screen
        name="Settings"
        component={SettingsNavigator}
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
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
            <Stack.Screen name="BookingConfirmationScreen" component={BookingConfirmationScreen} />
            <Stack.Screen name="OrdersScreen" component={BookingHistoryScreen} />
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
            <Stack.Screen name="BranchesScreen" component={BranchesScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
