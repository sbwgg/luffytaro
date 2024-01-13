"use server";

import db from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const actionComment = async (formData: FormData, userId?: string) => {
  const comment = formData.get("comment") as string;
  const isSpoiler = formData.get("spoiler") as string;

  const spoiler = !isSpoiler ? false : true;

  try {
    const data = db.comment.create({
      data: {
        userId: userId as string,
        comment,
        spoiler,
      },
      include: {
        user: {
          select: {
            profile: true,
            username: true,
            id: true,
          },
        },
        replyComment: {
          include: {
            user: {
              select: {
                username: true,
                profile: true,
                id: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/");
    return data;
  } catch (error) {
    console.log(error);
  }
};
