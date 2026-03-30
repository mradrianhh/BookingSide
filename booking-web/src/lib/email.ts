import nodemailer from 'nodemailer';

let transporter: any = null;

function getTransporter() {
  if (!transporter) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
    }
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendContactEmail(
  customerName: string,
  customerEmail: string,
  message: string
) {
  try {
    const mail = getTransporter();
    await mail.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: customerEmail,
      subject: `Contact Form Submission from ${customerName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendBookingConfirmation(
  customerEmail: string,
  customerName: string,
  bookingDate: Date,
  participants: number
) {
  try {
    const mail = getTransporter();
    await mail.sendMail({
      from: process.env.GMAIL_USER,
      to: customerEmail,
      subject: 'Booking Confirmation - RIB Safari',
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for booking with us!</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Date: ${bookingDate.toLocaleDateString()}</li>
          <li>Number of Participants: ${participants}</li>
        </ul>
        <p>We look forward to seeing you!</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation:', error);
    throw error;
  }
}

export async function sendBookingCancellation(
  customerEmail: string,
  customerName: string,
  bookingDate: Date,
  participants: number,
  explanation: string
) {
  try {
    const mail = getTransporter();
    await mail.sendMail({
      from: process.env.GMAIL_USER,
      to: customerEmail,
      subject: 'Booking Cancellation - RIB Safari',
      html: `
        <h2>Booking Cancellation</h2>
        <p>Dear ${customerName},</p>
        <p>We regret to inform you that your RIB Safari booking has been cancelled.</p>
        <p><strong>Cancelled Booking Details:</strong></p>
        <ul>
          <li>Date: ${bookingDate.toLocaleDateString()}</li>
          <li>Number of Participants: ${participants}</li>
        </ul>
        <p><strong>Reason for Cancellation:</strong></p>
        <p>${explanation.replace(/\n/g, '<br>')}</p>
        <p>We sincerely apologize for any inconvenience this may cause. If you have any questions or concerns, please do not hesitate to contact us.</p>
        <p>Best regards,<br>RIB Safari Team</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    throw error;
  }
}
