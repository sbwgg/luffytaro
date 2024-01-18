"use server";

import db from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const actionLikeComment = async (commentId: string, userId?: string) => {
  const comment = await db.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  const isLiked = comment?.like.includes(userId as string);

  if (isLiked) {
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        like: {
          set: comment?.like.filter((id) => id !== userId),
        },
      },
    });

    revalidatePath("/");
  } else {
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        like: {
          push: userId,
        },
        dislike: {
          set: comment?.dislike.filter((id) => id !== userId),
        },
      },
    });

    revalidatePath("/");
  }
};
