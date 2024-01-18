import db from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") as string;

  try {
    const notification = await db.notification.findMany({
      where: {
        notifReceiverId: userId,
      },
      include: {
        notifSender: {
          select: {
            username: true,
            profile: true,
          },
        },
      },
    });

    return NextResponse.json(notification, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
