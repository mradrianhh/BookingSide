import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { type, message, bookingId } = await req.json();

    if (!type || !message) {
      return NextResponse.json(
        { error: 'Type and message are required' },
        { status: 400 }
      );
    }

    if (!['booking', 'cancellation'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      );
    }

    const result = await query(
      'INSERT INTO notifications (type, message, booking_id) VALUES ($1, $2, $3) RETURNING *',
      [type, message, bookingId || null]
    );

    return NextResponse.json({ notification: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
