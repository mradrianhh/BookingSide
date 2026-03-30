import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getBookings, query } from '@/lib/db';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, bookingDate, participants, participantNames, notes } = body;

    if (!customerName || !customerEmail || !customerPhone || !bookingDate || !participants) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if booking would exceed slot capacity
    const bookingDateObj = new Date(bookingDate);
    const bookingDateStr = bookingDateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    const bookingTimeStr = bookingDateObj.toISOString().split('T')[1].substring(0, 8); // HH:MM:SS

    // Find matching slot
    const slotResult = await query(
      `SELECT id, max_seats FROM available_slots 
       WHERE slot_date::date = $1::date AND start_time = $2::time`,
      [bookingDateStr, bookingTimeStr]
    );

    if (slotResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Selected time slot is no longer available' },
        { status: 404 }
      );
    }

    const slot = slotResult.rows[0];
    const maxSeats = slot.max_seats;

    // Count existing bookings for this slot
    const bookingsResult = await query(
      `SELECT COALESCE(SUM(participants), 0) as total_booked FROM bookings 
       WHERE booking_date::date = $1::date AND booking_date::time = $2::time`,
      [bookingDateStr, bookingTimeStr]
    );

    const totalBooked = parseInt(bookingsResult.rows[0].total_booked);
    const remainingSeats = maxSeats - totalBooked;

    if (participants > remainingSeats) {
      return NextResponse.json(
        { error: `Only ${remainingSeats} seat${remainingSeats !== 1 ? 's' : ''} available for this time slot` },
        { status: 409 }
      );
    }

    const booking = await createBooking(
      customerName,
      customerEmail,
      customerPhone,
      bookingDateObj,
      participants,
      participantNames || [],
      notes
    );

    try {
      await sendBookingConfirmation(customerEmail, customerName, bookingDateObj, participants, booking.cancellation_token);
    } catch (emailError) {
      console.warn('Booking created but confirmation email failed:', emailError);
    }

    // Create notification for admin
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking',
          message: `New booking from ${customerName} (${participants} participant${participants !== 1 ? 's' : ''})`,
          bookingId: booking.id,
        }),
      });
    } catch (notificationError) {
      console.warn('Notification failed:', notificationError);
      // Don't fail the booking if notification fails
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await getBookings();
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
