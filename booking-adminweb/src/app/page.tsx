'use client';

import { useState } from 'react';
import AdminCalendar from "@/components/AdminCalendar";
import NotificationButton from "@/components/NotificationButton";

interface Booking {
  id: number;
  booking_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  participants: number;
  participant_names: string;
}

export default function Home() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleBookingNotificationClick = (bookingId: number) => {
    // Fetch booking details and set selected booking
    fetch('/api/bookings')
      .then(res => res.json())
      .then(bookings => {
        const booking = bookings.find((b: Booking) => b.id === bookingId);
        if (booking) {
          setSelectedBooking(booking);
        }
      })
      .catch(err => console.error('Error fetching bookings:', err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white leading-tight">
                Admin Dashboard
              </h1>
              <p className="text-xl text-slate-300">Manage available booking slots and view reservations</p>
            </div>
            <div className="ml-4">
              <NotificationButton onBookingNotificationClick={handleBookingNotificationClick} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4">
          <AdminCalendar selectedBookingFromNotification={selectedBooking} onBookingSelected={() => setSelectedBooking(null)} />
        </div>
      </section>
    </div>
  );
}
