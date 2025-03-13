import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

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

    const uploadDir = path.join(process.cwd(), "public/uploads/booking/");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 50 * 1024 * 1024, // 50MB limit
        multiples: false, // Ensure single file handling
    });

    try {
        const [fields, files] = await form.parse(req);

        const rawFields: { [key: string]: string | number } = {};
        Object.keys(fields).forEach((key) => {
            rawFields[key] = fields[key]?.[0] ?? "";
        });
        
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
                    filePaths[key] = `/uploads/booking/${fileName}`;
                }
            } else if (fileData) {
                // Single file scenario
                const file = fileData as formidable.File;
                const fileName = `${Date.now()}-${file.originalFilename}`;
                const filePath = path.join(uploadDir, fileName);

                fs.renameSync(file.filepath, filePath);
                filePaths[key] = `/uploads/booking/${fileName}`;
            }
        }

        const aadhaarCardNumber = rawFields.aadhaarCardNumber || "";
        const last4Digits = String(aadhaarCardNumber).slice(-4);
        const dateMonth = new Date().toISOString().slice(5, 7) + new Date().toISOString().slice(8, 10);
        const bookingId = `OM_BOOKING_${last4Digits}_${dateMonth}`;
        
        try {
            const booking = await prisma.booking.create({
                data: {
                    bookingId: bookingId as string,
                    name: rawFields.name as string,
                    email: rawFields.email as string,
                    aadhaarCardNumber: Number(rawFields.aadhaarCardNumber) as number,
                    photo: filePaths.photo as string,
                    workThrough: rawFields.workThrough as string,
                    registryCopy: filePaths.registryCopy as string,
                    panCardCopy: filePaths.panCardCopy as string,
                    aadharFrontCopy: filePaths.aadharFrontCopy as string,
                    aadharBackCopy: filePaths.aadharBackCopy as string,
                    workBy: rawFields.workBy as string,
                    plotSize: String(rawFields.plotSize) as string,
                    area: Number(rawFields.area) as number,
                    franchise_id: rawFields?.franchise_id as string,
                    status: 3,
                },
            });
        
            return res.status(200).json({
                success: true,
                message: "Booking data saved successfully",
                booking,
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
