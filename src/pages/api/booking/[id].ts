import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

// Use a singleton Prisma client to prevent multiple DB connections
const prisma = new PrismaClient();

/**
 * Validates and converts `id` to a number.
 */
const getId = (id: unknown) => {
  const parsedId = Number(id);
  return !id || Array.isArray(id) || isNaN(parsedId) ? null : parsedId;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = getId(req.query.id);

    if (!id) {
      return res.status(400).json({ message: "Valid ID is required" });
    }

    switch (req.method) {
      case "DELETE":
        await prisma.booking.delete({ where: { id } });
        return res.status(200).json({ message: "Record deleted successfully" });

      case "GET":
        const booking = await prisma.booking.findUnique({
          where: { id },
          include: { paymentDetails: true },
        });

        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }

        return res.status(200).json({ record: booking });

      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(`Error in ${req.method} request:`, error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
