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

        const { id } = req.query;

        const [fields] = await form.parse(req);

        const rawFields: { [key: string]: string | number } = {};
        Object.keys(fields).forEach((key) => {
            rawFields[key] = fields[key]?.[0] ?? "";
        });
        
        try {
            const branch = await prisma.jobOpenings.update({
                where: { id: Number(id) },
                data: {
                    jobTitle: rawFields.jobTitle as string,
                    jobDescription: rawFields.jobDescription as string,
                    jobCategory: rawFields.jobCategory as string,
                    jobLocation: rawFields.jobLocation as string,
                    status: Number(rawFields.status),
                    jobType: rawFields.jobType as string,
                },
            });
        
            return res.status(200).json({
                success: true,
                message: "Career updated successfully",
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
