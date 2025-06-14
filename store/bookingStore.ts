import { create } from 'zustand';

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

interface BookingState {
  bookings: Booking[];
  userId: string;
  setUserId: (id: string) => void;
  addBooking: (booking: Booking) => void;
  removeBooking: (id: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  userId: 'user1', // default or initial user id
  setUserId: (id: string) => set(() => ({ userId: id })),
  addBooking: (booking: Booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
  removeBooking: (id: string) => set((state) => ({ bookings: state.bookings.filter((b) => b.id !== id) })),
}));
