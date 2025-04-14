import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        // Parse the incoming form data
        const { youtubeVideoId } = await req.body;

        // Save image URL to the database
        try {
            const project = await prisma.ongoingProjects.create({
                data: { youtubeVideoId, position: 999 },
            });

            return res.status(200).json({
                success: true,
                message: "Image URL saved successfully",
                project,
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
