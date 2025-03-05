import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { pdfBytes, filename } = req.body;
    const buffer = Buffer.from(new Uint8Array(pdfBytes));

    // Define file path (inside public/uploads/)
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    fs.writeFileSync(filePath, buffer);

    // Return the file URL
    const BASE_URL = process.env.BASE_URL; // Fallback for local dev
    // Construct file URL
    const fileUrl = `${BASE_URL}/uploads/${filename}`;
    res.status(200).json({ fileUrl });
  } catch (error) {
    console.error("Error saving PDF:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
