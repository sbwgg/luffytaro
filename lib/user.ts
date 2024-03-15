import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/prismadb";

export default async function getUser() {
  try {
    const token = cookies().get("token")?.value || "";
    const decoded = jwt.verify(token, process.env.JWT_TOKEN!) as { id: string };
    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        username: true,
        email: true,
        profile: true,
        createdAt: true,
        updatedAt: true,
        id: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}
