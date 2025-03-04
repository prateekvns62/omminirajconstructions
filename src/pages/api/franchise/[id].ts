import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "ID is required and must be a single value." });
    }

    const franchiseId = Number(id);

    if (isNaN(franchiseId)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    if (req.method === "DELETE") {
      await prisma.franchiseRecord.delete({
        where: { id: franchiseId },
      });

      return res.status(200).json({ message: "Record deleted successfully" });
    } 
    
    else if (req.method === "POST") {
      try {
        let { status, franchiseCertificateUrl, gstNumber } = req.body;
  
        // Check if `updatedValues` was sent (Case 1)
        if (req.body.updatedValues) {
          ({ status, franchiseCertificateUrl, gstNumber } = req.body.updatedValues);
        }
  
        // Validate `status`
        if (typeof status !== "number") {
          return res.status(400).json({ message: "Invalid status value." });
        }
  
        const now = new Date();
  
        // Update the franchise record dynamically
        const updatedRecord = await prisma.franchiseRecord.update({
          where: { id: franchiseId }, // Extract franchiseId from URL
          data: {
            Status: status,
            updatedAt: now,
            franchiseCertificateUrl: status === 2 ? null : franchiseCertificateUrl,
            ...(gstNumber && {gstNumber}),
          },
        });
  
        return res.status(200).json({
          message: "Record updated successfully",
          record: updatedRecord,
        });
      } catch (error) {
        console.error("Error updating record:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    
    else if (req.method === "GET") {

      const franchise = await prisma.franchiseRecord.findUnique({
        where: { id: franchiseId },
      });

      return res.status(200).json({ record : franchise });
    } 

    else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
