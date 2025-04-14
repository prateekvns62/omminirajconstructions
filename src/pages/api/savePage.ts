import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
    api: {
      bodyParser: {
        sizeLimit: "50mb", // Increase limit to 10MB
      },
    },
  };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { id, identifier, title, html, css } = req.body;

    if (!identifier || !title || !html) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {

        if(id){
            const savedPage = await prisma.pageContent.update({
                where: {id},
                data: { html, css },
            });
            return res.status(200).json({ message: "Page saved successfully", savedPage });
        }
        const savedPage = await prisma.pageContent.create({
            data: { identifier, title, html, css },
        });
    
        return res.status(200).json({ message: "Page saved successfully", savedPage });
    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ error: "Internal Server Error", message:error });
    }
}