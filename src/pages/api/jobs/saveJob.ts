import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Disable Next.js default body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/job/");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 50 * 1024 * 1024, // 5MB limit
        multiples: false, // Ensure single file handling
    });
    try{
        const [fields, files] = await form.parse(req);

        const rawFields: { [key: string]: string | number } = {};
        Object.keys(fields).forEach((key) => {
            rawFields[key] = fields[key]?.[0] ?? "";
        });
        
        // Ensure files exist before processing
        const filePaths: { [key: string]: string | null } = {};
        for (const key in files) {
            const fileData = files[key]; // Can be File[] or File

            if (Array.isArray(fileData)) {
                // If multiple files are uploaded, take the first one
                const file = fileData[0];
                if (file) {
                    const fileName = `${Date.now()}-${file.originalFilename}`;
                    const filePath = path.join(uploadDir, fileName);

                    fs.renameSync(file.filepath, filePath);
                    filePaths[key] = `/uploads/job/${fileName}`;
                }
            } else if (fileData) {
                // Single file scenario
                const file = fileData as formidable.File;
                const fileName = `${Date.now()}-${file.originalFilename}`;
                const filePath = path.join(uploadDir, fileName);

                fs.renameSync(file.filepath, filePath);
                filePaths[key] = `/uploads/job/${fileName}`;
            }
        }
        try {

            const emailJobData = await prisma.jobApplication.findFirst({
                where: {
                    email: rawFields.email as string,
                    jobId: Number(rawFields.jobId),
                }
            });

            if(emailJobData){
                return res.status(400).json({ success: false, message: "You have already applied for this job. Duplicate applications are not allowed." });
            }


            const jobData = await prisma.jobApplication.create({
                data: {
                    name: rawFields.name as string,
                    resume: filePaths.resume as string,
                    email: rawFields.email as string,
                    status: Number(rawFields.status),
                    contact: rawFields.contact as string,
                    coverLetter: rawFields.coverLetter as string,
                    submittedBy: Number(rawFields.submittedBy),
                    jobId: Number(rawFields.jobId),
                },
                include: { job: true },
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
                    const mailOptions = {
                        from: process.env.EMAIL_FROM,
                        to: recipientEmail,
                        subject:  `Application Submitted for ${jobData.job?.jobTitle}`,
                        html: `
                                <p>Dear ${jobData.name},</p>

                                <p>Thank you for applying for the position of <strong>"${jobData.job?.jobTitle}"</strong> at <strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong>.</p>

                                <p>We have received your application, and our team will review it shortly. If your profile matches our requirements, we will reach out to you soon.</p>

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

                    
                    const genralMailOptions = {
                        from: process.env.EMAIL_FROM,
                        to: process.env.GENERAL_EMAIL,
                        subject: `New Job Application: ${jobData.job?.jobTitle} - ${jobData.name}`,
                        html: `
                            <p><strong>New Job Application Received</strong></p>
                    
                            <p>A new candidate has applied for the position of <strong>"${jobData.job?.jobTitle}"</strong> at Om Miniraj Building & Construction Services Pvt. Ltd.</p>
                    
                            <h3>Applicant Details:</h3>
                            <ul>
                                <li><strong>Name:</strong> ${jobData.name}</li>
                                <li><strong>Email:</strong> ${jobData.email}</li>
                                <li><strong>Contact:</strong> ${jobData.contact}</li>
                            </ul>
                    
                            <h3>Job Details:</h3>
                            <ul>
                                <li><strong>Job Title:</strong> ${jobData.job?.jobTitle}</li>
                                <li><strong>Job Location:</strong> ${jobData.job?.jobLocation}</li>
                                <li><strong>Job Type:</strong> ${jobData.job?.jobType}</li>
                            </ul>
                    
                            <h3>Cover Letter:</h3>
                            <p>${jobData.coverLetter}</p>
                    
                            <p>Best Regards,</p>
                            <p><strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong></p>
                        `,
                    };
                    
                    transporter.sendMail(genralMailOptions);
                } catch (error) {
                    console.error("Error sending email:", error);
                }
            }

        
            return res.status(200).json({
                success: true,
                message: "Job application data saved successfully",
                jobData,
            });
        } catch (error) {
            console.error("Database Insert Error:", error);
            return res.status(500).json({ success: false, message: "Database insert failed", error });
        }
    } catch (error) {
        console.error("File Upload Error:", error);
        return res.status(500).json({ success: false, message: "Error processing files", error });
    }
}
