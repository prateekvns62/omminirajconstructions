import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Checks if the email or username already exists.
 */
const checkExistingUser = async (email: string, username: string) => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
};


/**
 * API handler for creating an admin user.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, email, username, password, status } = req.body;

    // Check if user already exists
    const existingUser = await checkExistingUser(email, username);
    if (existingUser) {
        if (existingUser.email === email) {
          return res.status(200).json({ message: "Email already exists in the admin user list" });
        }
        if (existingUser.username === username) {
          return res.status(200).json({ message: "Username already exists in the admin user list" });
        }
      }

    // Create the admin user
    const now = new Date();
    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
        name,
        email,
        username,
        password: hashedPassword,
        status,
        created_at: now,
        last_login: now,
        },
    });

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return res.status(500).json({ message: error });
  }
}
