import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
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

    const uploadDir = path.join(process.cwd(), "public/uploads/service/");

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 50 * 1024 * 1024, // 5MB limit
        multiples: false, // Ensure single file handling
    });
    try{
        const [fields] = await form.parse(req);

        const rawFields: { [key: string]: string | number } = {};
        Object.keys(fields).forEach((key) => {
            rawFields[key] = fields[key]?.[0] ?? "";
        });
        

        try {
            const testimonial = await prisma.customerTestimonials.create({
                data: {
                    customerName: rawFields.customerName as string,
                    reviewMessage: rawFields.reviewMessage as string,
                    showOnHome: rawFields.showOnHome  == "true" ? true : false as boolean,
                },
            });
        
            return res.status(200).json({
                success: true,
                message: "Testimonial data saved successfully",
                testimonial,
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
