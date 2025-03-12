import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { addHours } from "date-fns"; // For setting expiration time
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { email } = req.body;

        // Check if user exists
        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token (hashed)
        const salt = await bcrypt.genSalt(10);
        const token = await bcrypt.hash(email + Date.now().toString(), salt);
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(token)}`;

        // Set expiration time (1 hour from now)
        const expires = addHours(new Date(), 1);

        // Remove existing reset token for the user
        await prisma.passwordResetToken.deleteMany({ where: { email } });

        // Store the new reset token in the database
        await prisma.passwordResetToken.create({
            data: {
                user_id: user.id,
                email: user.email,
                token,
                expires,
            },
        });


        const recipientEmail = process.env.DEV_ENV === "1" ? process.env.TEST_EMAIL : user.email;

        // Setup Nodemailer transporter using SMTP from .env
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM, // Sender email
            to: recipientEmail,
            subject: "Reset Your Password - Om Miniraj Building & Construction Services Pvt. Ltd.",
            html: `
                <p>Hi ${user.name},</p>
                <p>We received a request to reset your password for your admin account at <strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong>. If you made this request, please click the link below to reset your password:</p>
                <p><a href="${resetLink}" style="display: inline-block; padding: 10px 15px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
                <p>If the button above does not work, you can also copy and paste the following link into your browser:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p><strong>Note:</strong> This link will expire in 1 hour for security reasons. If you did not request a password reset, please ignore this email, and your account will remain secure.</p>
                <p>For any assistance, feel free to contact our support team at <a href="mailto:support@omminiraj.com">support@omminiraj.com</a>.</p>
                <p>Best Regards,</p>
                <p><strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong></p>
            `,
        };
        

        await transporter.sendMail(mailOptions);

        // TODO: Send the reset link via email (mocked for now)
        console.log("Reset link:", resetLink);

        return res.status(200).json({ message: "Reset link sent!" });
    } catch (error) {
        console.error("Error in password reset:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}
