import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
    
      const services = await prisma.ourServices.findMany(
        { 
          where: {
            status: true,
          } 
        }
      );

      res.status(200).json({services});
    } catch (error) {
      res.status(500).json({ message: "Error Fetching records", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
