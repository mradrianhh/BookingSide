import { query, createNotification } from '@/lib/db';
import { sendBookingCancellation } from '@/lib/email';

export async function GET() {
  try {
    const result = await query('SELECT * FROM bookings ORDER BY booking_date DESC');
    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { bookingId, explanation } = await request.json();

    if (!bookingId || !explanation || typeof explanation !== 'string') {
      return Response.json(
        { error: 'Booking ID and explanation are required' },
        { status: 400 }
      );
    }

    // Fetch booking details before deletion
    const bookingResult = await query(
      'SELECT id, customer_name, customer_email, booking_date, participants FROM bookings WHERE id = $1',
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return Response.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const booking = bookingResult.rows[0];

    // Send cancellation email
    try {
      const bookingDate = new Date(booking.booking_date);
      await sendBookingCancellation(
        booking.customer_email,
        booking.customer_name,
        bookingDate,
        booking.participants,
        explanation
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with deletion even if email fails
    }

    // Create cancellation notification BEFORE deleting the booking
    try {
      await createNotification(
        'cancellation',
        `Booking cancelled for ${booking.customer_name} (${booking.participants} participants)`,
        bookingId
      );
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Don't fail the request if notification fails
    }

    // Delete the booking
    const deleteResult = await query(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      [bookingId]
    );

    return Response.json({
      success: true,
      message: 'Booking deleted and notification email sent',
      deletedBooking: deleteResult.rows[0],
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return Response.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
