import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id, replyMessage } = req.body; // ✅ Use req.body instead of req.json()

    if (!id || !replyMessage) {
      return res.status(400).json({ message: "ID and Reply Message are required" });
    }

    const savedReply = await prisma.contactUsReply.create({
      data: {
        contact_us_id: id,
        message: replyMessage,
      },
    });

    return res.status(200).json({ message: "Reply saved successfully!", savedReply });
  } catch (error) {
    console.error("Error saving reply:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
