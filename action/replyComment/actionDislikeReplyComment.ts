"use server";

import db from "@/lib/prismadb";

export const actionDislikeReplyComment = async (
  replyCommentId: string,
  userId?: string
) => {
  const replyComment = await db.replyComment.findUnique({
    where: {
      id: replyCommentId,
    },
  });

  const isDisliked = replyComment?.dislike.includes(userId as string);

  if (isDisliked) {
    await db.replyComment.update({
      where: {
        id: replyCommentId,
      },
      data: {
        dislike: {
          set: replyComment?.dislike.filter((id) => id !== userId),
        },
      },
    });
  } else {
    await db.replyComment.update({
      where: {
        id: replyCommentId,
      },
      data: {
        dislike: {
          push: userId,
        },
        like: {
          set: replyComment?.like.filter((id) => id !== userId),
        },
      },
    });
  }
};
