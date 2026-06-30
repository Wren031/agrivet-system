import { View, Text, TouchableOpacity, Platform } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Package, Heart, Clock, Settings } from 'lucide-react-native';
import { useThemeStore } from '../store/themeStore';
import { Colors } from '../constants/colors';

const tabIcons: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Home,
  Items: Package,
  Favorites: Heart,
  History: Clock,
  Settings,
};

const tabLabels: Record<string, string> = {
  Home: 'Home',
  Items: 'Items',
  Favorites: 'Favorites',
  History: 'History',
  Settings: 'Settings',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? Colors.dark : Colors.light;

  const tabBarStyle = descriptors[state.routes[state.index]?.key]?.options?.tabBarStyle as any;
  if (tabBarStyle?.display === 'none') return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.surface,
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        paddingTop: 8,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 12,
        elevation: 12,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const Icon = tabIcons[route.name] || Home;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 }}
          >
            <View style={{ marginBottom: 4 }}>
              <Icon
                size={22}
                color={isFocused ? '#059669' : theme.textTertiary}
              />
            </View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: isFocused ? '600' : '500',
                color: isFocused ? '#059669' : theme.textTertiary,
              }}
            >
              {tabLabels[route.name] || route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
