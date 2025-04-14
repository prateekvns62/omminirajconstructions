import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const directory = path.join(process.cwd(), "public/uploads/mediaGallery");
  if (!fs.existsSync(directory)) fs.mkdirSync(directory);

  const files = fs.readdirSync(directory).map((file) => `/uploads/mediaGallery/${file}`);
  res.status(200).json({ images: files });
}
