'use client';

import { useState, useEffect } from 'react';

interface AvailableSlot {
  id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  max_seats: number;
}

interface Booking {
  id: number;
  booking_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  participants: number;
  participant_names: string;
}

interface AdminCalendarProps {
  selectedBookingFromNotification?: Booking | null;
  onBookingSelected?: () => void;
}

export default function AdminCalendar({ selectedBookingFromNotification, onBookingSelected }: AdminCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [maxSeats, setMaxSeats] = useState('12');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSlots, setShowSlots] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancellationExplanation, setCancellationExplanation] = useState('');
  const [cancellationLoading, setCancellationLoading] = useState(false);

  useEffect(() => {
    fetchSlots();
    fetchBookings();
  }, []);

  useEffect(() => {
    // When a booking is selected from notification, open its detail modal
    if (selectedBookingFromNotification) {
      setSelectedBooking(selectedBookingFromNotification);
      onBookingSelected?.();
    }
  }, [selectedBookingFromNotification, onBookingSelected]);

  const fetchSlots = async () => {
    try {
      const response = await fetch('/api/slots');
      const data = await response.json();
      setSlots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !startTime || !endTime || !maxSeats) {
      setMessage('Please fill in all required fields');
      return;
    }

    const seatsNum = parseInt(maxSeats);
    if (seatsNum < 1) {
      setMessage('Max seats must be at least 1');
      return;
    }

    setLoading(true);
    try {
      // Format date as YYYY-MM-DD in local timezone
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const localDateStr = `${year}-${month}-${day}`;

      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotDate: localDateStr,
          startTime,
          endTime,
          maxSeats: seatsNum,
        }),
      });

      if (response.ok) {
        setMessage('Slot added successfully!');
        fetchSlots();
        setStartTime('08:00');
        setEndTime('09:00');
        setMaxSeats('12');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Error adding slot. Please try again.');
      }
    } catch (error) {
      setMessage('Error adding slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (!confirm('Delete this slot?')) return;

    try {
      const response = await fetch(`/api/slots?id=${slotId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSlots();
        setMessage('Slot deleted successfully!');
      } else {
        setMessage('Error deleting slot.');
      }
    } catch (error) {
      setMessage('Error deleting slot.');
    }
  };

  const getBookingsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return bookings.filter(b => b.booking_date.startsWith(dateStr));
  };

  const getSlotsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return slots.filter(s => {
      const slotDateOnly = s.slot_date.split('T')[0]; // Handle ISO format timestamps
      return slotDateOnly === dateStr;
    });
  };

  const getBookingsForSlot = (slot: AvailableSlot): Booking[] => {
    const slotDate = slot.slot_date.split('T')[0];
    return bookings.filter(b => {
      const bookingDatePart = b.booking_date.split('T')[0];
      const bookingTime = b.booking_date.split('T')[1];
      return bookingDatePart === slotDate && bookingTime && bookingTime.startsWith(slot.start_time);
    });
  };

  const handleCancelBooking = async () => {
    if (!cancellingBooking || !cancellationExplanation.trim()) {
      setMessage('Please provide an explanation for the cancellation.');
      return;
    }

    setCancellationLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: cancellingBooking.id,
          explanation: cancellationExplanation.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Booking cancelled successfully. Notification email sent to customer.');
        setCancellingBooking(null);
        setCancellationExplanation('');
        setSelectedBooking(null);
        fetchBookings();
      } else {
        setMessage(data.error || 'Error cancelling booking.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error cancelling booking.');
    } finally {
      setCancellationLoading(false);
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null);

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Calendar</h3>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition"
              >
                ← Prev
              </button>
              <h4 className="text-xl font-bold text-white">{monthName}</h4>
              <button
                onClick={handleNextMonth}
                className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition"
              >
                Next →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-slate-400 text-xs font-semibold">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              {days.map(day => {
                const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const isSelected = selectedDate && 
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentDate.getMonth() &&
                  selectedDate.getFullYear() === currentDate.getFullYear();
                const bookingCount = getBookingsForDate(dayDate).length;
                const slotCount = getSlotsForDate(dayDate).length;

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg font-semibold transition relative ${
                      isSelected
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-slate-700/50 text-slate-300 border border-cyan-500/20 hover:bg-slate-600/50 hover:border-cyan-400/50'
                    }`}
                  >
                    <span className="text-sm">{day}</span>
                    {(bookingCount > 0 || slotCount > 0) && (
                      <span className="text-xs mt-1">
                        {slotCount > 0 && <span>🟦{slotCount}</span>}
                        {bookingCount > 0 && <span>📅{bookingCount}</span>}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <p className="mt-4 text-center text-cyan-300 font-semibold">
                Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        {/* Slot Management Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Add Available Slot</h3>

          {selectedDate ? (
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div className="p-3 bg-slate-700/30 border border-cyan-500/20 rounded-lg">
                <p className="text-slate-300 text-sm">
                  <strong>Date:</strong> {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">Available Seats</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={maxSeats}
                  onChange={(e) => setMaxSeats(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Slot'}
              </button>

              {message && (
                <p className={`text-sm ${message.includes('successfully') ? 'text-green-400' : 'text-yellow-400'}`}>
                  {message}
                </p>
              )}
            </form>
          ) : (
            <p className="text-slate-400 text-center py-8">Select a date to add a slot</p>
          )}
        </div>
      </div>

      {/* Slots and Bookings Display */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Available Slots */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Available Slots</h3>
          {selectedDate && getSlotsForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getSlotsForDate(selectedDate).map(slot => {
                const slotsForThisTime = getSlotsForDate(selectedDate).filter(s => 
                  s.start_time === slot.start_time && s.end_time === slot.end_time
                );
                const bookingsForSlot = getBookingsForDate(selectedDate).filter(b => {
                  const bookingTime = b.booking_date.split('T')[1];
                  return bookingTime && bookingTime.startsWith(slot.start_time);
                });
                const bookedSeats = bookingsForSlot.reduce((sum, b) => sum + b.participants, 0);
                const remainingSeats = slot.max_seats - bookedSeats;

                return (
                  <div 
                    key={slot.id} 
                    className="p-4 bg-slate-700/30 border border-cyan-500/20 rounded-lg cursor-pointer hover:bg-slate-700/50 transition"
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-semibold">{slot.start_time} - {slot.end_time}</p>
                        <p className="text-slate-400 text-sm">{slot.slot_date}</p>
                        <p className="text-cyan-300 text-sm mt-2">
                          💺 {remainingSeats} / {slot.max_seats} seats available
                        </p>
                        {bookingsForSlot.length > 0 && (
                          <p className="text-blue-300 text-sm">
                            📅 {bookingsForSlot.length} booking{bookingsForSlot.length !== 1 ? 's' : ''} ({bookedSeats} participants)
                          </p>
                        )}
                        <p className="text-slate-500 text-xs mt-2">👆 Click to view participants</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlot(slot.id);
                        }}
                        className="px-3 py-1 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 hover:bg-red-500/30 transition text-sm flex-shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : selectedDate ? (
            <p className="text-slate-400 text-center py-8">No slots for this date</p>
          ) : (
            <p className="text-slate-400 text-center py-8">Select a date to view slots</p>
          )}
        </div>

        {/* Bookings */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Bookings</h3>
          {selectedDate && getBookingsForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getBookingsForDate(selectedDate).map(booking => (
                <div 
                  key={booking.id} 
                  className="p-4 bg-slate-700/30 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-slate-700/50 transition"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <p className="text-white font-semibold">{booking.customer_name}</p>
                  <p className="text-slate-400 text-sm">{booking.customer_email}</p>
                  <p className="text-cyan-300 text-sm">👥 {booking.participants} participant{booking.participants !== 1 ? 's' : ''}</p>
                  <p className="text-slate-500 text-xs mt-2">👆 Click to view details</p>
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <p className="text-slate-400 text-center py-8">No bookings for this date</p>
          ) : (
            <p className="text-slate-400 text-center py-8">Select a date to view bookings</p>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-cyan-300 font-semibold mb-3">Contact Person</h4>
                <div className="space-y-2 pl-4 border-l border-cyan-500/30">
                  <p className="text-white">
                    <span className="text-slate-400">Name: </span>
                    {selectedBooking.customer_name}
                  </p>
                  <p className="text-white">
                    <span className="text-slate-400">Email: </span>
                    <a href={`mailto:${selectedBooking.customer_email}`} className="text-blue-300 hover:text-blue-200">
                      {selectedBooking.customer_email}
                    </a>
                  </p>
                  <p className="text-white">
                    <span className="text-slate-400">Phone: </span>
                    <a href={`tel:${selectedBooking.customer_phone}`} className="text-blue-300 hover:text-blue-200">
                      {selectedBooking.customer_phone}
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-cyan-300 font-semibold mb-3">Participants ({selectedBooking.participants})</h4>
                <div className="space-y-2 pl-4 border-l border-cyan-500/30">
                  {selectedBooking.participant_names && selectedBooking.participant_names !== '[]' ? (
                    (() => {
                      try {
                        const names = JSON.parse(selectedBooking.participant_names);
                        return names.map((name: string, idx: number) => (
                          <p key={idx} className="text-slate-300">
                            {idx + 1}. {name}
                          </p>
                        ));
                      } catch {
                        return <p className="text-slate-400 italic">No participant names recorded</p>;
                      }
                    })()
                  ) : (
                    <p className="text-slate-400 italic">No participant names recorded</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-slate-400 text-sm mb-4">
                  Booked on: {new Date(selectedBooking.booking_date).toLocaleString()}
                </p>
                <button
                  onClick={() => setCancellingBooking(selectedBooking)}
                  className="w-full px-4 py-2 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 hover:bg-red-500/30 transition"
                >
                  🗑️ Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slot Details Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedSlot.start_time} - {selectedSlot.end_time}</h3>
                <p className="text-slate-400 text-sm">{selectedSlot.slot_date}</p>
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-cyan-300 font-semibold mb-2">
                  💺 Capacity: {selectedSlot.max_seats} seats max
                </p>
                <p className="text-blue-300 font-semibold mb-4">
                  📅 {getBookingsForSlot(selectedSlot).length} booking{getBookingsForSlot(selectedSlot).length !== 1 ? 's' : ''} ({getBookingsForSlot(selectedSlot).reduce((sum, b) => sum + b.participants, 0)} participants)
                </p>
              </div>

              {getBookingsForSlot(selectedSlot).length > 0 ? (
                <div>
                  <h4 className="text-cyan-300 font-semibold mb-3">Booked Participants</h4>
                  <div className="space-y-4">
                    {getBookingsForSlot(selectedSlot).map((booking, idx) => (
                      <div key={booking.id} className="p-3 bg-slate-700/30 border border-blue-500/20 rounded-lg">
                        <p className="text-white font-semibold">{idx + 1}. {booking.customer_name}</p>
                        <p className="text-slate-400 text-sm">{booking.customer_email}</p>
                        <p className="text-slate-400 text-sm">
                          📞 {booking.customer_phone}
                        </p>
                        <p className="text-cyan-300 text-sm mt-2">
                          👥 {booking.participants} participant{booking.participants !== 1 ? 's' : ''}:
                        </p>
                        <div className="ml-4 mt-2 space-y-1">
                          {booking.participant_names && booking.participant_names !== '[]' ? (
                            (() => {
                              try {
                                const names = JSON.parse(booking.participant_names);
                                return names.map((name: string, pIdx: number) => (
                                  <p key={pIdx} className="text-slate-300 text-sm">
                                    • {name}
                                  </p>
                                ));
                              } catch {
                                return <p className="text-slate-400 italic text-sm">No names recorded</p>;
                              }
                            })()
                          ) : (
                            <p className="text-slate-400 italic text-sm">No names recorded</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No bookings for this slot</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Cancellation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-red-500/30 rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">Cancel Booking</h3>
              <button
                onClick={() => {
                  setCancellingBooking(null);
                  setCancellationExplanation('');
                }}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-300 text-sm">
                  ⚠️ This will send a cancellation email to {cancellingBooking.customer_name} ({cancellingBooking.customer_email})
                </p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Explanation for Cancellation*
                </label>
                <textarea
                  value={cancellationExplanation}
                  onChange={(e) => setCancellationExplanation(e.target.value)}
                  placeholder="Explain why this booking is being cancelled..."
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 h-32 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCancellingBooking(null);
                    setCancellationExplanation('');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white hover:bg-slate-600 transition"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancellationLoading || !cancellationExplanation.trim()}
                  className="flex-1 px-4 py-2 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {cancellationLoading ? '⏳ Cancelling...' : '🗑️ Cancel Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
