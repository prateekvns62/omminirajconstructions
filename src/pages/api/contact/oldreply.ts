import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    console.error("Method not allowed: ", req.method);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Get ID from the request body
    const { id } = req.body;

    // Check if ID is provided
    if (!id) {
      console.error("ID is required, but not provided.");
      return res.status(400).json({ message: "ID required" });
    }

    // Try to fetch the reply associated with the ID
    const user = await prisma.contactUsReply.findMany({
      where: { contact_us_id: id },
    });

    // If no reply is found for the given ID
    if (!user) {
      console.log(`No reply found for ID: ${id}`);
      return res.status(404).json({ message: "No reply found for the given ID" });
    }

    // Return the found reply
    return res.status(200).json({ user });
  } catch (error) {
    // Log the error in detail
    console.error("Error fetching reply: ", error);

    // Return a generic 500 error message for internal server issues
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Ensure Prisma disconnects after request
    await prisma.$disconnect();
  }
}
