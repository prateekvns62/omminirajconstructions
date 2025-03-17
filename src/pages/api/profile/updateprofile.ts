import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userId, status, newPassword } = req.body;

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(400).json({ message: "User Not found!" });
    }

    const updateData: { status?: number; password?: string } = {};

    // Validate and hash password if provided
    if (newPassword && typeof newPassword === "string" && newPassword.trim() !== "") {
      updateData.password = await hash(newPassword, 10);
    }

    // Validate and update status
    const numericStatus = parseInt(status, 10);
    if (!isNaN(numericStatus)) {
      updateData.status = numericStatus;
    }

    // Ensure updateData is not empty
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    if (newPassword && typeof newPassword === "string" && newPassword.trim() !== "") {
      await prisma.passwordResetToken.deleteMany({ where: { email:updatedUser.email } });
    }
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}
