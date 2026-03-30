import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM available_slots ORDER BY slot_date, start_time');
    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return Response.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { slotDate, startTime, endTime, maxSeats } = await request.json();

    if (!slotDate || !startTime || !endTime || !maxSeats) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for overlapping slots on the same date
    const existingSlots = await query(
      `SELECT * FROM available_slots 
       WHERE slot_date = $1 
       AND (
         (start_time < $3 AND end_time > $2)
       )`,
      [slotDate, startTime, endTime]
    );

    if (existingSlots.rows.length > 0) {
      return Response.json(
        { error: 'This time slot overlaps with an existing slot on this date' },
        { status: 409 }
      );
    }

    const result = await query(
      'INSERT INTO available_slots (slot_date, start_time, end_time, max_seats) VALUES ($1, $2, $3, $4) RETURNING *',
      [slotDate, startTime, endTime, maxSeats]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating slot:', error);
    return Response.json({ error: 'Failed to create slot' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get('id');

    if (!slotId) {
      return Response.json({ error: 'Slot ID required' }, { status: 400 });
    }

    await query('DELETE FROM available_slots WHERE id = $1', [slotId]);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting slot:', error);
    return Response.json({ error: 'Failed to delete slot' }, { status: 500 });
  }
}
