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

    // Create cancellation notification for admin BEFORE deleting the booking
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cancellation',
          message: `Booking cancelled by ${booking.customer_name} for ${new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(booking.booking_date))}${feedback ? ': ' + feedback.substring(0, 50) : ''}`,
          bookingId: booking.id,
        }),
      });
    } catch (notificationError) {
      console.error('Failed to create cancellation notification:', notificationError);
      // Don't fail the request if notification fails
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
