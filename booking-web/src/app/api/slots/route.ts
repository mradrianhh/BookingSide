import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM available_slots ORDER BY slot_date, start_time');
    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return Response.json([], { status: 200 });
  }
}
