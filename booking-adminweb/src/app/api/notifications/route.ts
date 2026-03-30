import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        n.id,
        n.type,
        n.message,
        n.is_read,
        n.created_at,
        b.customer_name,
        b.booking_date,
        b.participants
      FROM notifications n
      LEFT JOIN bookings b ON n.booking_id = b.id
      ORDER BY n.created_at DESC
      LIMIT 50
    `);
    
    return NextResponse.json({ notifications: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, notificationId } = await req.json();

    if (action === 'mark-as-read') {
      if (!notificationId) {
        return NextResponse.json(
          { error: 'Notification ID is required' },
          { status: 400 }
        );
      }

      await query(
        'UPDATE notifications SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [notificationId]
      );

      return NextResponse.json(
        { success: true, message: 'Notification marked as read' },
        { status: 200 }
      );
    }

    if (action === 'mark-all-as-read') {
      await query(
        'UPDATE notifications SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP WHERE is_read = FALSE'
      );

      return NextResponse.json(
        { success: true, message: 'All notifications marked as read' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
