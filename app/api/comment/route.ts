import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  try {
    const comments = await db.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            profile: true,
            username: true,
          },
        },
        replyComment: {
          include: {
            user: {
              select: {
                id: true,
                profile: true,
                username: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(comments);
  } catch (e) {
    console.log(e);
  }
};
