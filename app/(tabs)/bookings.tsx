import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import React from 'react';
import { Alert, FlatList, Platform, StatusBar, Text, View } from 'react-native';
import tw from 'twrnc';
import { useBookingStore } from '../../store/bookingStore';
import api from '../../utils/api';

const queryClient = new QueryClient();

const fetchBookings = async () => {
  const res = await api.get('/bookings');
  return res.data;
};

function BookingsScreen() {
  const zustandBookings = useBookingStore((state) => state.bookings);
  const userId = useBookingStore((state) => state.userId);
  const { data: apiBookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  // Combine API and Zustand bookings, showing only current user's
  const allBookings = [...apiBookings, ...zustandBookings].filter(
    (b) => b.userId === userId
  );

  if (isLoading) return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-lg`}>Loading...</Text>
    </View>
  );
  if (error) return 
  <Text style={tw`text-center mt-8 `}>Error loading bookings</Text>;

  if (allBookings.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-gray-500 text-lg`}>No bookings found</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white p-4 pt-14`}>
      <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"} />
      <FlatList
        data={allBookings}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          let statusColor = tw`bg-green-100`;
          let statusTextColor = tw`text-green-700`;
          if (item.status === 'pending') {
            statusColor = { backgroundColor: '#FFF7ED' };
            statusTextColor = tw`text-yellow-700`;
          } else if (item.status === 'cancelled') {
            statusColor = tw`bg-red-100`;
            statusTextColor = tw`text-red-700`;
          }
          const isZustandBooking = zustandBookings.some(b => b.id === item.id);
          return (
            <View style={[tw`mb-4 p-4 border rounded border-gray-200`, statusColor]}>
              <Text style={tw`text-lg font-bold mb-1`}>Booking ID: {item.id}</Text>
              <Text>Property ID: {item.propertyId}</Text>
              <Text>User ID: {item.userId}</Text>
              <Text>Check-in: {item.checkIn}</Text>
              <Text>Check-out: {item.checkOut}</Text>
              <Text style={[tw`font-bold`, statusTextColor]}>Status: {item.status}</Text>
              {item.status !== 'cancelled' && isZustandBooking && (
                <Text
                  style={tw`mt-2 text-red-500 underline`}
                  onPress={() => {
                    Alert.alert(
                      'Cancel Booking',
                      'Are you sure you want to cancel this booking?',
                      [
                        { text: 'No', style: 'cancel' },
                        {
                          text: 'Yes',
                          style: 'destructive',
                          onPress: () => useBookingStore.getState().removeBooking(item.id),
                        },
                      ]
                    );
                  }}
                >
                  Cancel Booking
                </Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

export default function Bookings() {
  return (
    <QueryClientProvider client={queryClient}>
      <BookingsScreen />
    </QueryClientProvider>
  );
}
