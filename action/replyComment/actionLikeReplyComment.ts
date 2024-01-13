"use server";

import db from "@/lib/prismadb";

export const actionLikeReplyComment = async (
  replyCommentId: string,
  userId?: string
) => {
  const replyComment = await db.replyComment.findUnique({
    where: {
      id: replyCommentId,
    },
  });

  const isLiked = replyComment?.like.includes(userId as string);

  if (isLiked) {
    await db.replyComment.update({
      where: {
        id: replyCommentId,
      },
      data: {
        like: {
          set: replyComment?.like.filter((id) => id !== userId),
        },
      },
    });
  } else {
    await db.replyComment.update({
      where: {
        id: replyCommentId,
      },
      data: {
        like: {
          push: userId,
        },
        dislike: replyComment?.dislike.filter((id) => id !== userId),
      },
    });
  }
};
