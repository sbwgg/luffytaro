import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const episodeId = req.nextUrl.searchParams.get("episodeId") as string;

  try {
    const comments = await db.comment.findMany({
      where: {
        episodeId,
      },
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
