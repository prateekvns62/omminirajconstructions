import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface OngoingProjects {
    id: number;
    youtubeVideoId: string;
    position: number;
  }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const projects = req.body.projects;

        try {
            await Promise.all(
                projects.map((project:OngoingProjects, index:number) =>
                  prisma.ongoingProjects.update({ where: { id: project.id }, data: { position: index } })
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
