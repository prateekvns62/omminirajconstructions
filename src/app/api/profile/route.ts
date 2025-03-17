import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { PrismaClient } from "@prisma/client";
import '@ant-design/v5-patch-for-react-19';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email! },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      created_at: true,
      last_login: true,
      status:true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
