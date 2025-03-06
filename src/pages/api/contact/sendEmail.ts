import nodemailer from "nodemailer";

export default async function handler(req:any, res:any) {
    
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {name, email, message, userMessage} = req.body;

    // Setup Nodemailer transporter using SMTP from .env
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
    });

    const recipientEmail = process.env.DEV_ENV === "1" ? process.env.TEST_EMAIL : email;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject: `${name} - Response to Your Contact Us Inquiry`,
      html: `
          <p>Hi ${name},</p>
          <p>Thank you for reaching out to us.</p>
          <p><strong>Your Query:</strong></p>
          <blockquote>${userMessage}</blockquote>
          <p><strong>Below is our response to your message:</strong></p>
          <blockquote>${message}</blockquote>
          <p>If you have any further questions, feel free to contact us or reply on the same email.</p>
          <p>Best Regards,</p>
          <p><strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong></p>
      `,
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: error });
  }
}
