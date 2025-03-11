import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  try {
    const { token } = await req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    
    const user = await prisma.passwordResetToken.findUnique({
      where: { token: token },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
