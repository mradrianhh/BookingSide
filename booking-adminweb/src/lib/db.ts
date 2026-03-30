import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(
  text: string,
  params?: (string | number | Date | boolean)[]
): Promise<QueryResult> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database error', { text, error });
    throw error;
  }
}

export async function getBookings() {
  const result = await query(
    'SELECT * FROM bookings ORDER BY booking_date ASC'
  );
  return result.rows;
}

export async function createBooking(
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  bookingDate: Date,
  participants: number,
  notes?: string
) {
  const result = await query(
    'INSERT INTO bookings (customer_name, customer_email, customer_phone, booking_date, participants, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [customerName, customerEmail, customerPhone, bookingDate, participants, notes || null] as any
  );
  return result.rows[0];
}

export async function getAvailableDates(month: number, year: number) {
  const result = await query(
    'SELECT DISTINCT DATE(booking_date) as date, COUNT(*) as count FROM bookings WHERE EXTRACT(MONTH FROM booking_date) = $1 AND EXTRACT(YEAR FROM booking_date) = $2 GROUP BY DATE(booking_date)',
    [month, year]
  );
  return result.rows;
}

export async function createNotification(
  type: 'booking' | 'cancellation',
  message: string,
  bookingId?: number
) {
  const result = await query(
    'INSERT INTO notifications (type, message, booking_id) VALUES ($1, $2, $3) RETURNING *',
    [type, message, bookingId || null] as any
  );
  return result.rows[0];
}
