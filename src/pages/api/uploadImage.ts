import fs from "fs";
import path from "path";
import formidable, { File } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

export const config = { api: { bodyParser: false } };

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    const uploadDir = path.join(process.cwd(), "public/uploads/mediaGallery");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
        uploadDir,
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
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

        const { files } = await parseForm(req);

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
                const newFilePath = path.join(process.cwd(), "public/uploads/mediaGallery", fileName);

                fs.renameSync(file.filepath, newFilePath);
                filePath = `/uploads/mediaGallery/${fileName}`;
            }
        } else {
            // Single file scenario
            const file = uploadedFile;
            const fileName = `${Date.now()}-${file.originalFilename}`;
            const newFilePath = path.join(process.cwd(), "public/uploads/mediaGallery", fileName);

            fs.renameSync(file.filepath, newFilePath);
            filePath = `/uploads/mediaGallery/${fileName}`;
        }

        if (!filePath) {
            return res.status(500).json({ success: false, message: "File upload failed" });
        }

        res.status(200).json({ success: true, url: `${filePath}` });
}
