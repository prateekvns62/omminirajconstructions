import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
        const { id, status } = req.body;

        // Validate `id`
        if (!id) {
          return res.status(400).json({ message: "ID is required" });
        }
  
        // Validate `status` (optional but recommended)
        if (status === undefined) {
          return res.status(400).json({ message: "Status is required" });
        }
  
        // Update booking status
        const jobData = await prisma.jobApplication.update({
          where: { id },
          data: {
            status,
          },
          include: {
            job: true,
          }
        });


        if(jobData){
          const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              },
          });
      
          const recipientEmail = process.env.DEV_ENV === "1" ? process.env.TEST_EMAIL : jobData.email;
          try{
            const isAccepted = status === 1;
            
            const subject = isAccepted
              ? `Application Accepted for ${jobData.job?.jobTitle}`
              : `Application Rejected for ${jobData.job?.jobTitle}`;
            
            const message = isAccepted
              ? `<p>Dear ${jobData.name},</p>
                  <p>We are pleased to inform you that your application for the position of <strong>"${jobData.job?.jobTitle}"</strong> at <strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong> has been <strong>accepted</strong>.</p>
                  <p>Our team will be in touch with you regarding the next steps.</p>`
              : `<p>Dear ${jobData.name},</p>
                  <p>We appreciate your interest in the <strong>"${jobData.job?.jobTitle}"</strong> position at <strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong>.</p>
                  <p>Unfortunately, after careful review, we have decided to proceed with other candidates for this role.</p>
                  <p>We encourage you to apply for future openings that match your profile.</p>`;
            
            const mailOptions = {
              from: process.env.EMAIL_FROM,
              to: recipientEmail,
              subject: subject,
              html: `
                ${message}
                <h3>Job Details:</h3>
                <ul>
                  <li><strong>Job Title:</strong> ${jobData.job?.jobTitle}</li>
                  <li><strong>Job Location:</strong> ${jobData.job?.jobLocation}</li>
                  <li><strong>Job Type:</strong> ${jobData.job?.jobType}</li>
                </ul>
                <p>If you have any questions, feel free to reach out to us.</p>
                <p>Best Regards,</p>
                <p><strong>Hiring Team</strong></p>
                <p><strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong></p>
              `,
            };            
              
              transporter.sendMail(mailOptions);
          } catch (error) {
              console.error("Error sending email:", error);
          }
        }

      res.status(200).json({ message: "Record Updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error while updating record", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
