import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
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

// Helper function to parse form data asynchronously
const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    const form = formidable({
        uploadDir: path.join(process.cwd(), "public/uploads/gallery"),
        keepExtensions: true,
        maxFileSize: 50 * 1024 * 1024, // 50MB limit
        multiples: false, // Single file only
    });

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        // Parse the incoming form data
        const { files } = await parseForm(req);

        // Ensure a file was uploaded
        const fileKey = Object.keys(files)[0]; // Get the first uploaded file key
        if (!fileKey || !files[fileKey]) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const uploadedFile = files[fileKey] as File | File[]; // Handle single file case

        let filePath: string | null = null;

        if (Array.isArray(uploadedFile)) {
            // If multiple files are uploaded, pick the first one
            if (uploadedFile.length > 0) {
                const file = uploadedFile[0];
                const fileName = `${file.originalFilename}`;
                const newFilePath = path.join(process.cwd(), "public/uploads/gallery", fileName);

                fs.renameSync(file.filepath, newFilePath);
                filePath = `/uploads/gallery/${fileName}`;
            }
        } else {
            // Single file scenario
            const file = uploadedFile;
            const fileName = `${Date.now()}-${file.originalFilename}`;
            const newFilePath = path.join(process.cwd(), "public/uploads/gallery", fileName);

            fs.renameSync(file.filepath, newFilePath);
            filePath = `/uploads/gallery/${fileName}`;
        }

        if (!filePath) {
            return res.status(500).json({ success: false, message: "File upload failed" });
        }

        // Save image URL to the database
        try {
            const image = await prisma.imageGallery.create({
                data: { image: filePath, position: 999 },
            });

            return res.status(200).json({
                success: true,
                message: "Image URL saved successfully",
                image,
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
