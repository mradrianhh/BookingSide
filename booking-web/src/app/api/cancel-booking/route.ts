import { query } from '@/lib/db';
import { sendBookingCancellationConfirmation } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { cancellationToken, feedback } = await req.json();

    if (!cancellationToken) {
      return NextResponse.json(
        { error: 'Cancellation token is required' },
        { status: 400 }
      );
    }

    // Fetch booking details before deletion
    const bookingResult = await query(
      'SELECT id, customer_name, customer_email, customer_phone, booking_date, participants FROM bookings WHERE cancellation_token = $1',
      [cancellationToken]
    );

    if (bookingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found or already cancelled' },
        { status: 404 }
      );
    }

    const booking = bookingResult.rows[0];

    // Send cancellation confirmation email
    try {
      const bookingDate = new Date(booking.booking_date);
      await sendBookingCancellationConfirmation(
        booking.customer_email,
        booking.customer_name,
        bookingDate,
        booking.participants,
        feedback
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with deletion even if email fails
    }

    // Delete the booking
    await query(
      'DELETE FROM bookings WHERE cancellation_token = $1',
      [cancellationToken]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Booking cancelled successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
