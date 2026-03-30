'use client';

import { useState, useEffect } from 'react';

interface AvailableSlot {
  id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  max_seats: number;
}

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [participants, setParticipants] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [participantNames, setParticipantNames] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchAvailableSlots();
    fetchBookings();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch('/api/slots');
      const data = await response.json();
      setAvailableSlots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      const bookingList = data.bookings && Array.isArray(data.bookings) ? data.bookings : [];
      setBookings(bookingList);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const hasAvailableSlot = (date: Date): boolean => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return availableSlots.some(slot => {
      const slotDateOnly = slot.slot_date.split('T')[0];
      const remainingSeats = getRemainingSeats(slot);
      return slotDateOnly === dateStr && remainingSeats > 0;
    });
  };

  const getRemainingSeats = (slot: AvailableSlot): number => {
    const slotDate = slot.slot_date.split('T')[0];
    const bookingsForSlot = bookings.filter(b => {
      const bookingDatePart = b.booking_date.split('T')[0];
      const bookingTime = b.booking_date.split('T')[1];
      return bookingDatePart === slotDate && bookingTime && bookingTime.startsWith(slot.start_time);
    });
    const bookedSeats = bookingsForSlot.reduce((sum, b) => sum + b.participants, 0);
    return slot.max_seats - bookedSeats;
  };

  const getSlotsByDate = (date: Date): AvailableSlot[] => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return availableSlots.filter(slot => {
      const slotDateOnly = slot.slot_date.split('T')[0];
      const remainingSeats = getRemainingSeats(slot);
      return slotDateOnly === dateStr && remainingSeats > 0;
    }).sort((a, b) => a.start_time.localeCompare(b.start_time));
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
    if (hasAvailableSlot(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !name || !email || !phone || !selectedSlotId) {
      setMessage('Please fill in all required fields and select a time slot');
      return;
    }

    // Validate participant names
    const filledParticipantNames = participantNames.filter(n => n.trim());
    if (filledParticipantNames.length !== participants) {
      setMessage(`Please enter full names for all ${participants} participant(s)`);
      return;
    }

    const selectedSlot = availableSlots.find(s => s.id === selectedSlotId);
    if (!selectedSlot) {
      setMessage('Invalid time slot selected');
      return;
    }

    setLoading(true);
    try {
      // Combine date with selected slot time
      const bookingDateTime = new Date(selectedDate);
      const [hours, minutes, seconds] = selectedSlot.start_time.split(':');
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || '0'), 0);

      // Construct ISO string manually to avoid timezone conversion issues
      // Convert to local YYYY-MM-DDTHH:MM:SS format, then to ISO
      const year = bookingDateTime.getFullYear();
      const month = String(bookingDateTime.getMonth() + 1).padStart(2, '0');
      const day = String(bookingDateTime.getDate()).padStart(2, '0');
      const hr = String(bookingDateTime.getHours()).padStart(2, '0');
      const min = String(bookingDateTime.getMinutes()).padStart(2, '0');
      const sec = String(bookingDateTime.getSeconds()).padStart(2, '0');
      const bookingDateString = `${year}-${month}-${day}T${hr}:${min}:${sec}.000Z`;

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          bookingDate: bookingDateString,
          participants,
          participantNames: filledParticipantNames,
          notes,
        }),
      });

      if (response.ok) {
        setMessage('Booking submitted successfully! Check your email for confirmation.');
        setName('');
        setEmail('');
        setPhone('');
        setNotes('');
        // Keep selectedDate to show updated slots with new seat counts
        setSelectedSlotId(null);
        setParticipants(1);
        setParticipantNames(['']);
        await fetchBookings();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Error submitting booking. Please try again.';
        setMessage(errorMessage);
      }
    } catch (error) {
      setMessage('Error submitting booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-xl p-12">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition font-semibold"
          >
            ← Prev
          </button>
          <h4 className="text-2xl font-bold text-white">{monthName}</h4>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition font-semibold"
          >
            Next →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-3 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-slate-400 text-sm font-bold">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          {days.map(day => {
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isSelected = selectedDate && 
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === currentDate.getMonth() &&
              selectedDate.getFullYear() === currentDate.getFullYear();
            const hasSlot = hasAvailableSlot(dayDate);
            
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={!hasSlot}
                className={`aspect-square flex items-center justify-center rounded-lg font-bold text-lg transition ${
                  isSelected
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                    : hasSlot
                    ? 'bg-slate-700/50 text-slate-300 border border-cyan-500/20 hover:bg-slate-600/50 hover:border-cyan-400/50 cursor-pointer'
                    : 'bg-slate-800/30 text-slate-500 border border-slate-700/50 opacity-50 cursor-not-allowed'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <p className="mt-6 text-center text-cyan-300 font-bold text-lg">
            Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-slate-200 text-sm font-bold mb-3 text-cyan-300">Contact Person</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400"
              required
            />
          </div>
        </div>

        {selectedDate && (
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-3">Select Time Slot</label>
            <div className="grid grid-cols-2 gap-3">
              {getSlotsByDate(selectedDate).map(slot => {
                const remainingSeats = getRemainingSeats(slot);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                      selectedSlotId === slot.id
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-slate-700/50 text-slate-300 border border-cyan-500/20 hover:bg-slate-600/50 hover:border-cyan-400/50'
                    }`}
                  >
                    <div>{slot.start_time} - {slot.end_time}</div>
                    <div className="text-xs opacity-75 mt-1">
                      💺 {remainingSeats} seat{remainingSeats !== 1 ? 's' : ''} left
                    </div>
                  </button>
                );
              })}
            </div>
            {getSlotsByDate(selectedDate).length === 0 && (
              <p className="text-slate-400 text-sm">No time slots available for this date</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="text-slate-300">Participants:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={participants}
            onChange={(e) => {
              const newCount = parseInt(e.target.value);
              setParticipants(newCount);
              setParticipantNames(Array(newCount).fill(''));
            }}
            className="w-20 px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white"
          />
        </div>

        {participants > 0 && (
          <div>
            <h3 className="text-slate-200 text-sm font-bold mb-3 text-cyan-300">Participant Names</h3>
            <div className="space-y-2">
              {Array(participants).fill(null).map((_, index) => (
                <input
                  key={`participant-${index}`}
                  type="text"
                  placeholder={`Participant ${index + 1} Full Name`}
                  value={participantNames[index] || ''}
                  onChange={(e) => {
                    const newNames = [...participantNames];
                    newNames[index] = e.target.value;
                    setParticipantNames(newNames);
                  }}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400"
                  required
                />
              ))}
            </div>
          </div>
        )}

        <textarea
          placeholder="Special notes or requests"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400 h-24"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Book Now'}
        </button>
        {message && (
          <p className={`text-sm ${message.includes('successfully') ? 'text-green-400' : 'text-yellow-400'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
