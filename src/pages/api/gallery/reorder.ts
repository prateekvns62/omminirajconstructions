import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface Image {
    id: number;
    image: string;
    position: number;
  }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const images = req.body.images;

        try {
            await Promise.all(
                images.map((image:Image, index:number) =>
                  prisma.imageGallery.update({ where: { id: image.id }, data: { position: index } })
                )
              );

            return res.status(200).json({
                success: true,
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
