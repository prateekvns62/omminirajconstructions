import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
    
      const certificates = await prisma.activeCertificate.findMany(
        { 
          where: {
            status: true,
          } 
        }
      );

      res.status(200).json({certificates});
    } catch (error) {
      res.status(500).json({ message: "Error Fetching records", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
