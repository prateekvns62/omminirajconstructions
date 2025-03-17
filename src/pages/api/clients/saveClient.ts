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

    const uploadDir = path.join(process.cwd(), "public/uploads/client/");

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
                    filePaths[key] = `/uploads/client/${fileName}`;
                }
            } else if (fileData) {
                // Single file scenario
                const file = fileData as formidable.File;
                const fileName = `${Date.now()}-${file.originalFilename}`;
                const filePath = path.join(uploadDir, fileName);

                fs.renameSync(file.filepath, filePath);
                filePaths[key] = `/uploads/client/${fileName}`;
            }
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = {
                type: Number(rawFields.type),  // Convert to integer
                srNo: Number(rawFields.srNo),  // Convert to integer
                createdAt: new Date(),
            };
            
            // Assign only if value exists
            if (rawFields.name) data.name = rawFields.name as string;
            if (rawFields.location) data.location = rawFields.location as string;
            if (filePaths.image) data.image = filePaths.image as string;

            
            const client = await prisma.ourClients.create({ data });
        
            return res.status(200).json({
                success: true,
                message: "Client data saved successfully",
                client,
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
