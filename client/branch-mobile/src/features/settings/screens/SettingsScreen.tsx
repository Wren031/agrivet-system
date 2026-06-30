import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  User, Shield, Bell, FileText, Info, HelpCircle, LogOut,
  ChevronRight, Moon, Sun,
} from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { useAuth } from '../../../context/AuthContext';
import { useThemeStore } from '../../../store/themeStore';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}

function MenuItem({ icon, label, onPress, right, danger }: MenuItemProps) {
  const { colors } = useColorTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: colors.border,
      }}
    >
      <View style={{ width: 32, alignItems: 'center' }}>{icon}</View>
      <Text style={{ flex: 1, fontSize: 14, color: danger ? colors.error : colors.text, fontWeight: '500', marginLeft: 12 }}>
        {label}
      </Text>
      {right || <ChevronRight size={18} color={colors.textTertiary} />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => logout() },
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>Settings</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('EditProfile')}
        style={{
          flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
          marginHorizontal: 16, borderRadius: 16, padding: 16,
          borderWidth: 1, borderColor: colors.border,
        }}
      >
        <Image
          source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=User&background=22C55E&color=fff&size=200' }}
          style={{ width: 56, height: 56, borderRadius: 16 }}
        />
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>{user?.fullName || 'John Doe'}</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{user?.email || 'customer@agrivet.com'}</Text>
        </View>
        <ChevronRight size={20} color={colors.textTertiary} />
      </TouchableOpacity>

      <View style={{
        backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 20, borderRadius: 16,
        borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
      }}>
        <MenuItem icon={<User size={20} color={colors.text} />} label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
        <MenuItem icon={<Shield size={20} color={colors.text} />} label="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
        <MenuItem
          icon={<Bell size={20} color={colors.text} />}
          label="Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />
      </View>

      <View style={{
        backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 16, borderRadius: 16,
        borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
      }}>
        <MenuItem icon={<FileText size={20} color={colors.text} />} label="Privacy Policy" onPress={() => {}} />
        <MenuItem icon={<Info size={20} color={colors.text} />} label="About" onPress={() => {}} />
        <MenuItem icon={<HelpCircle size={20} color={colors.text} />} label="Help Center" onPress={() => {}} />
      </View>

      <View style={{
        backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 16, borderRadius: 16,
        borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
      }}>
        <MenuItem
          icon={isDark ? <Moon size={20} color={colors.text} /> : <Sun size={20} color={colors.text} />}
          label="Dark Mode"
          right={
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                width: 44, height: 24, borderRadius: 12,
                backgroundColor: isDark ? colors.primary : colors.surfaceVariant,
                justifyContent: 'center', paddingHorizontal: 3,
              }}
            >
              <View style={{
                width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff',
                alignSelf: isDark ? 'flex-end' : 'flex-start',
              }} />
            </TouchableOpacity>
          }
          onPress={toggleTheme}
        />
      </View>

      <View style={{
        marginHorizontal: 16, marginTop: 16, borderRadius: 16, overflow: 'hidden',
        borderWidth: 1, borderColor: colors.border,
      }}>
        <MenuItem
          icon={<LogOut size={20} color={colors.error} />}
          label="Logout"
          danger
          onPress={handleLogout}
        />
      </View>

      <View style={{ padding: 16, alignItems: 'center', marginBottom: 40 }}>
        <Text style={{ fontSize: 12, color: colors.textTertiary }}>Agrivet Customer App v1.0.0</Text>
      </View>
    </ScrollView>
  );
}
