"use server";

import db from "@/lib/prismadb";

export const actionDislikeComment = async (
  commentId: string,
  userId?: string
) => {
  const comment = await db.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  const isDisliked = comment?.dislike.includes(userId as string);

  if (isDisliked) {
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        dislike: {
          set: comment?.dislike.filter((id) => id !== userId),
        },
      },
    });
  } else {
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        dislike: {
          push: userId,
        },
        like: {
          set: comment?.like.filter((id) => id !== userId),
        },
      },
    });
  }
};
