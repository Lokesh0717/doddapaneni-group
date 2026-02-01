import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = contactSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validationResult.error.issues }, { status: 400 });
    }

    const { name, email, message } = validationResult.data;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials are not set. Add EMAIL_USER and EMAIL_PASS to .env.local');
      return NextResponse.json(
        { message: 'Email is not configured. Add EMAIL_USER and EMAIL_PASS to .env.local (use a Gmail App Password for Gmail).' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to the user
    const userMailOptions = {
      from: `"Doddapaneni Group" <${process.env.EMAIL_USER}>`,
      to: email,
      replyTo: process.env.EMAIL_USER,
      subject: `Thank you for contacting Doddapaneni Group`,
      text: `Hello ${name},\n\nThank you for reaching out to Doddapaneni Group. We have received your message:\n\n"${message}"\n\nOur team will review your inquiry and get back to you shortly.\n\nBest regards,\nDoddapaneni Group Team`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <h2 style="color: #1e3a8a; border-bottom: 2px solid #eee; padding-bottom: 10px;">Thank you for contacting us</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for reaching out to Doddapaneni Group. We have successfully received your message.</p>
          <div style="background-color: #f9fafb; border-left: 4px solid #1e3a8a; padding: 15px; margin: 20px 0; font-style: italic; color: #555;">
            "${message}"
          </div>
          <p>Our team will review your inquiry and get back to you as soon as possible.</p>
          <br/>
          <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0 0; font-weight: bold; color: #1e3a8a;">Doddapaneni Group Team</p>
          </div>
        </div>
      `,
    };

    // Email to the admin (notification)
    const adminMailOptions = {
      from: `"DG Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sending to self
      replyTo: email, // Reply directly to the user
      subject: `New Inquiry: ${name} - Doddapaneni Group`,
      text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #1e3a8a; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; width: 100px; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #1e3a8a; text-decoration: none;">${email}</a></td>
            </tr>
          </table>
          
          <div style="margin-top: 25px;">
            <p style="font-weight: bold; color: #555; margin-bottom: 10px;">Message:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; white-space: pre-wrap; border: 1px solid #e5e7eb;">${message}</div>
          </div>
          
          <div style="margin-top: 30px; font-size: 13px; color: #888;">
            <p>This email was sent from the Doddapaneni Group website contact form.</p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: `Could not send email: ${errMessage}. If using Gmail, use an App Password (not your normal password).` },
      { status: 500 }
    );
  }
}
