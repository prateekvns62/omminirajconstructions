import { type AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

// Create a singleton Prisma client
const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password")
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: credentials.email }, { username: credentials.email }],
          },
        })

        if (!user) {
          throw new Error("User not found")
        }

        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        if (!passwordMatch) {
          throw new Error("Incorrect Password!")
        }

        if (user.status === 0) {
          throw new Error("Account Disabled!")
        }
        const now = new Date()
        if (user.status === 1) {
          await prisma.user.update({
            where: { id: user.id },
            data: { last_login: now },
          })
        }

        return { id: user.id.toString(), email: user.email, name: user.name }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in .env.local
  pages: {
    signIn: "/admin/login",
  },
}
