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

    const uploadDir = path.join(process.cwd(), "public/uploads/franchise/");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB limit
        multiples: false, // Ensure single file handling
    });

    try {
        const [fields, files] = await form.parse(req);

            // Convert fields to store single values as strings, except for `doYouHave`
            const rawFields: { [key: string]: string | string[] } = {};

            Object.entries(fields).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    rawFields[key] = key === "doYouHave" ? value : value[0] || ""; // Ensure non-array fields get a string
                } else {
                    rawFields[key] = (value as unknown as string) || ""; // Ensure undefined becomes an empty string
                }
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
                    filePaths[key] = `/uploads/franchise/${fileName}`;
                }
            } else if (fileData) {
                // Single file scenario
                const file = fileData as formidable.File;
                const fileName = `${Date.now()}-${file.originalFilename}`;
                const filePath = path.join(uploadDir, fileName);

                fs.renameSync(file.filepath, filePath);
                filePaths[key] = `/uploads/franchise/${fileName}`;
            }
        }

        const aadhaarCardNumber = rawFields.aadhaarCardNumber || "";
        const last4Digits = aadhaarCardNumber.slice(-4);
        const dateMonth = new Date().toISOString().slice(5, 7) + new Date().toISOString().slice(8, 10);
        const franchiseId = `OM_${last4Digits}_${dateMonth}`;

        const completeFormData = { ...rawFields, ...filePaths, franchiseId };

        try {
            const franchise = await prisma.franchiseRecord.create({
                
                data: {
                    franchiseId: franchiseId,
                    name: rawFields.name as string,
                    email: rawFields.email as string,
                    address: rawFields.address as string,
                    doYouHave: JSON.stringify(rawFields.doYouHave), // Store as JSON string
                    mobileNumber: rawFields.mobileNumber as string,
                    gstNumber: rawFields.gstNumber as string,
                    aadhaarCardNumber: rawFields.aadhaarCardNumber as string,
                    accountNumber: rawFields.accountNumber as string,
                    ifscCode: rawFields.ifscCode as string,
                    message: rawFields.message as string,
                    passbookCopy: filePaths.passbookCopy as string,
                    panCardCopy: filePaths.panCardCopy as string,
                    aadharFrontCopy: filePaths.aadharFrontCopy as string,
                    aadharBackCopy: filePaths.aadharBackCopy as string,
                },
            });
        
            return res.status(200).json({
                success: true,
                message: "Franchise data saved successfully",
                franchise,
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
