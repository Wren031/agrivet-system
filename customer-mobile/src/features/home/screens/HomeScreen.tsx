import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Bell } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { useAuthStore } from '../../../store/authStore';
import { StatCard } from '../../../components/cards/StatCard';
import { RecentOrderCard } from '../components/RecentOrderCard';
import { useHome } from '../hooks/useHome';
import { getGreeting } from '../../../utils/helpers';
import { StatSkeleton, BookingSkeleton } from '../../../components/loading/SkeletonLoader';
import { ErrorState } from '../../../components/ui/ErrorState';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const user = useAuthStore((s) => s.user);
  const { statistics, recentOrders, isLoading, error, loadData } = useHome();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  if (error && !isLoading) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
    >
      <View style={{ padding: 20, paddingTop: 60 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>{getGreeting()},</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 2 }}>
              {user?.fullName || 'John Doe'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings', { screen: 'Notifications' })}
            style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: colors.surfaceVariant, justifyContent: 'center', alignItems: 'center',
            }}
          >
            <Bell size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Dashboard</Text>
        {isLoading ? (
          <StatSkeleton />
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {statistics.map((stat) => (
              <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
            ))}
          </View>
        )}
      </View>

      <View style={{ padding: 16, paddingTop: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '600' }}>See All</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <BookingSkeleton />
        ) : recentOrders.length === 0 ? (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>No orders yet</Text>
          </View>
        ) : (
          recentOrders.map((booking) => (
            <RecentOrderCard
              key={booking.id}
              booking={booking}
              onPress={() => navigation.navigate('History', { screen: 'BookingDetail', params: { bookingId: booking.id } })}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
