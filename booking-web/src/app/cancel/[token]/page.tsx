'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BookingDetails {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  participants: number;
  participant_names: string;
}

export default function CancelBookingPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${token}`);
        if (!response.ok) {
          setError('Booking not found or link has expired');
          setLoading(false);
          return;
        }
        const data = await response.json();
        setBooking(data.booking);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Unable to load booking. Please try again or contact support.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBooking();
    }
  }, [token]);

  const handleCancel = async () => {
    if (!booking) return;

    setCancelling(true);
    try {
      const response = await fetch('/api/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cancellationToken: token,
          feedback: feedback.trim() || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCancelled(true);
        setError(null);
      } else {
        setError(data.error || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Unable to cancel booking. Please try again or contact support.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-slate-300">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-red-500/30 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">❌ Booking Not Found</h1>
          <p className="text-slate-300 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-green-500/30 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">✅ Booking Cancelled</h1>
          <p className="text-slate-300 mb-4">
            Your booking has been successfully cancelled. A confirmation email has been sent to {booking?.customer_email}.
          </p>
          <p className="text-slate-400 text-sm mb-6">
            If you have any questions, please contact us.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md mx-auto mt-8">
        <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm mb-8 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-slate-800 border border-cyan-500/20 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Cancel Booking</h1>

          {booking && (
            <div className="space-y-6">
              <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                <h2 className="text-cyan-300 font-semibold mb-3">Booking Details</h2>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300">
                    <span className="text-slate-400">Name:</span> {booking.customer_name}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Email:</span> {booking.customer_email}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Phone:</span> {booking.customer_phone}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Date:</span>{' '}
                    {new Date(booking.booking_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-400">Participants:</span> {booking.participants}
                  </p>
                  {booking.participant_names && booking.participant_names !== '[]' && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                      <p className="text-slate-400 text-xs mb-2">Participant Names:</p>
                      <ul className="text-slate-300 text-xs space-y-1">
                        {(() => {
                          try {
                            const names = JSON.parse(booking.participant_names);
                            return names.map((name: string, idx: number) => (
                              <li key={idx}>• {name}</li>
                            ));
                          } catch {
                            return null;
                          }
                        })()}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-white font-semibold mb-2">
                  Optional Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Let us know why you're cancelling (optional)..."
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none h-24"
                />
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-300 text-sm">
                  ⚠️ This action is permanent. After cancellation, you will need to make a new booking if you wish to rebook.
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/"
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center hover:bg-slate-600 transition"
                >
                  Keep Booking
                </Link>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 px-4 py-2 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {cancelling ? '⏳ Cancelling...' : '🗑️ Cancel Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
