import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [loadBookings])
  );

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
        style={{ flexGrow: 0, marginBottom: 4 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => changeTab(tab.value)}
              activeOpacity={0.7}
              style={{ paddingVertical: 10, paddingHorizontal: 10 }}
            >
              <Text style={{
                fontSize: 13, fontWeight: isActive ? '700' : '500',
                color: isActive ? '#059669' : colors.textSecondary,
                letterSpacing: 0.2,
              }}>
                {tab.label}
              </Text>
              {isActive && (
                <View style={{
                  height: 2.5,
                  backgroundColor: '#059669',
                  borderRadius: 2,
                  marginTop: 6,
                  width: '100%',
                }} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={['#059669']} tintColor="#059669" />}
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
