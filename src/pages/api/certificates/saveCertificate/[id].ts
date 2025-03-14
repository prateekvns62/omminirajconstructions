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

    const uploadDir = path.join(process.cwd(), "public/uploads/certificate/");

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

        const { id } = req.query;

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
                    filePaths[key] = `/uploads/certificate/${fileName}`;
                }
            } else if (fileData) {
                // Single file scenario
                const file = fileData as formidable.File;
                const fileName = `${Date.now()}-${file.originalFilename}`;
                const filePath = path.join(uploadDir, fileName);

                fs.renameSync(file.filepath, filePath);
                filePaths[key] = `/uploads/certificate/${fileName}`;
            }
        }
        try {
            const certificate = await prisma.activeCertificate.update({
                where: { id: Number(id) },
                data: {
                    identifier: rawFields.identifier as string,
                    title: rawFields.title ? rawFields.title as string : "",
                    status: rawFields.status == "true" ? true : false as boolean,
                    certificateId: rawFields.certificateId as string,
                    certificateApprovalDate: rawFields.certificateApprovalDate && rawFields.certificateApprovalDate !== ""
                        ? new Date(rawFields.certificateApprovalDate)
                        : new Date(new Date().setDate(new Date().getDate() - 1)), // ✅ Yesterday if empty
                    expiredDate: rawFields.expiredDate && rawFields.expiredDate !== ""
                        ? new Date(rawFields.expiredDate)
                        : new Date(new Date().setFullYear(new Date().getFullYear() + 30)), // ✅ 30 years from now
                    priority: isNaN(Number(rawFields.priority)) ? 0 : Number(rawFields.priority),
                    showOnHome: rawFields.showOnHome  == "true" ? true : false as boolean,
                    pdf: filePaths.pdf as string,
                    img: filePaths.img as string,
                },
            });
        
            return res.status(200).json({
                success: true,
                message: "Certificate updated successfully",
                certificate,
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
