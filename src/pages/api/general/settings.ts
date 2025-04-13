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

const initialSettings = [
    { name: "loan_agreement", label: "Loan Agreement" },
    { name: "customer_agreement", label: "Customer Agreement"},
    { name: "thekedar_agreement", label: "Thekedar Agreement"},
    { name: "details_of_material", label: "Details of Material" },
    { name: "more_information", label: "More Information" }
  ];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/general/");

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
                    const fileName = `${key}.pdf`;
                    const filePath = path.join(uploadDir, fileName);

                    fs.renameSync(file.filepath, filePath);
                    filePaths[key] = `/uploads/general/${fileName}`;
                }
            } else if (fileData) {
                const file = fileData as formidable.File;
                const fileName = `${key}.pdf`;
                const filePath = path.join(uploadDir, fileName);

                fs.renameSync(file.filepath, filePath);
                filePaths[key] = `/uploads/general/${fileName}`;
            }
            
        }
        try {
            const promises = Object.entries(filePaths).map(async ([key, value]) => {
                const setting = await prisma.generalSetting.findUnique({
                    where: { key },
                });
        
                if (setting) {
                    // update if exists
                    await prisma.generalSetting.update({
                        where: { key },
                        data: {
                            value,
                        },
                    });
                } else {
                    // create if not exists
                    const label = key.replace(/_/g, ' ').toUpperCase();
                    await prisma.generalSetting.create({
                        data: {
                            key,
                            title: label,
                            value,
                        },
                    });
                }
            });
        
            await Promise.all(promises);
        
            return res.status(200).json({
                success: true,
                message: "Data saved successfully",
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
