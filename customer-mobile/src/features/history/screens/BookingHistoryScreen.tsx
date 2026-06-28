import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { BookingCard } from '../../../components/cards/BookingCard';
import { useBookingHistory } from '../hooks/useBookingHistory';
import { BookingStatus } from '../../../types';
import { BookingSkeleton } from '../../../components/loading/SkeletonLoader';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';

const tabs: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Processing', value: 'processing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function BookingHistoryScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { bookings, activeTab, isLoading, error, loadBookings, changeTab } = useBookingHistory();

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = useCallback(() => {
    loadBookings();
  }, [loadBookings]);

  if (error && !isLoading) {
    return <ErrorState message={error} onRetry={loadBookings} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>Booking History</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 44, marginBottom: 4 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            onPress={() => changeTab(tab.value)}
            style={{
              paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
              backgroundColor: activeTab === tab.value ? colors.primary : colors.surfaceVariant,
              marginRight: 8,
            }}
          >
            <Text style={{
              fontSize: 12, fontWeight: '600',
              color: activeTab === tab.value ? '#fff' : colors.textSecondary,
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        {isLoading ? (
          <BookingSkeleton />
        ) : bookings.length === 0 ? (
          <EmptyState title="No Bookings Found" message={`No ${activeTab === 'all' ? '' : activeTab + ' '}bookings to display.`} />
        ) : (
          <View style={{ paddingVertical: 8 }}>
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
