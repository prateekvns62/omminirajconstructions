import nodemailer from "nodemailer";

export default async function handler(req:any, res:any) {
    
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {id, name, email, bookingId, plotSize, area } = req.body;

    // Setup Nodemailer transporter using SMTP from .env
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
    });

    const recipientEmail = process.env.DEV_ENV === "1" ? process.env.TEST_EMAIL : email;
    const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/booking/payment/${id}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject: `Payment Reminder: Booking #${bookingId}`,
  html: `
      <p>Hi ${name},</p>
      <p>This is a gentle reminder for your pending payment.</p>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p><strong>Area:</strong> ${area} sq. ft.</p>
      <p><strong>Amount Due:</strong> ${plotSize} INR</p> <!-- Use plotSize as amount -->
      <p>Please complete your payment as soon as possible.</p>
      <p>To proceed with your payment, please click the button below:</p>
      <p style="text-align: center;">
        <a href="${paymentLink}" 
           style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
          Complete Your Payment
        </a>
      </p>

      <p>Or you can copy and paste this link into your browser:</p>
      <p><a href="${paymentLink}">${paymentLink}</a></p>
      <p></p>

      <p>Best Regards,</p>
      <p><strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong></p>`,
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: error });
  }
}
