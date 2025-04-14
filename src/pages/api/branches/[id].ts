import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    try {
      // Await and destructure params correctly
      const { id } = req.query;

      if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: "ID is required" });
      }

      await prisma.branches.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting record", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
