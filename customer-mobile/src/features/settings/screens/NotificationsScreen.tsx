import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useCallback } from 'react';
import { Bell, ShoppingBag, Tag, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { useNotifications } from '../hooks/useNotifications';
import { EmptyState } from '../../../components/ui/EmptyState';

const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  booking_approved: CheckCircle,
  booking_ready: Bell,
  booking_cancelled: AlertTriangle,
  new_product: ShoppingBag,
  promo: Tag,
};

const iconColors: Record<string, string> = {
  booking_approved: '#22C55E',
  booking_ready: '#3B82F6',
  booking_cancelled: '#EF4444',
  new_product: '#8B5CF6',
  promo: '#F59E0B',
};

export default function NotificationsScreen() {
  const { colors } = useColorTheme();
  const { notifications, unreadCount, isLoading, loadNotifications, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '600' }}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        {notifications.length === 0 && !isLoading ? (
          <EmptyState title="No Notifications" message="You're all caught up!" icon={Bell} />
        ) : (
          notifications.map((notif) => {
            const Icon = iconMap[notif.type] || Bell;
            const iconColor = iconColors[notif.type] || colors.textSecondary;
            return (
              <TouchableOpacity
                key={notif.id}
                onPress={() => markAsRead(notif.id)}
                style={{
                  flexDirection: 'row', padding: 14, marginHorizontal: 16, marginVertical: 4,
                  backgroundColor: notif.read ? colors.surface : colors.primary + '08',
                  borderRadius: 12,
                  borderWidth: 1, borderColor: notif.read ? colors.border : colors.primary + '20',
                }}
              >
                <View style={{
                  width: 40, height: 40, borderRadius: 12,
                  backgroundColor: iconColor + '20',
                  justifyContent: 'center', alignItems: 'center',
                }}>
                  <Icon size={20} color={iconColor} />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, fontWeight: notif.read ? '500' : '700', color: colors.text, flex: 1 }}>
                      {notif.title}
                    </Text>
                    {!notif.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 }} />}
                  </View>
                  <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 16 }}>
                    {notif.message}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textTertiary, marginTop: 6 }}>
                    {new Date(notif.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
