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

    const uploadDir = path.join(process.cwd(), "public/uploads/branch/");

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
                    filePaths[key] = `/uploads/branch/${fileName}`;
                }
            } else if (fileData) {
                // Single file scenario
                const file = fileData as formidable.File;
                const fileName = `${Date.now()}-${file.originalFilename}`;
                const filePath = path.join(uploadDir, fileName);

                fs.renameSync(file.filepath, filePath);
                filePaths[key] = `/uploads/branch/${fileName}`;
            }
        }

        try {
            const image = filePaths?.image ?? "";
            const branch = await prisma.branches.create({
                data: {
                    branchCode: rawFields.branchCode as string,
                    branchName: rawFields.branchName as string,
                    location: rawFields.location as string,
                    priority: Number(rawFields.priority) as number,
                    status: rawFields.status == "true" ? true : false as boolean,
                    mapIframe: rawFields.mapIframe as string,
                    image: image,
                },
            });
        
            return res.status(200).json({
                success: true,
                message: "Branch data saved successfully",
                branch,
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
