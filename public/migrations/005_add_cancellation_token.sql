-- Add cancellation_token to bookings table
ALTER TABLE bookings
ADD COLUMN cancellation_token VARCHAR(255) UNIQUE NOT NULL DEFAULT gen_random_uuid()::text;

-- Create index for faster lookups
CREATE INDEX idx_bookings_cancellation_token ON bookings(cancellation_token);
