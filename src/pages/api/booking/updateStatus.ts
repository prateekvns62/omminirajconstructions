import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
        const { id, status } = req.body;

        // Validate `id`
        if (!id) {
          return res.status(400).json({ message: "ID is required" });
        }
  
        // Validate `status` (optional but recommended)
        if (status === undefined) {
          return res.status(400).json({ message: "Status is required" });
        }
  
        // Update booking status
        await prisma.booking.update({
          where: { id },
          data: {
            status,
            updatedAt: new Date(),
          },
        });
  

      res.status(200).json({ message: "Record Updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error while updating record", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
