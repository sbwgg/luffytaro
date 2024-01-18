"use server";

import db from "@/lib/prismadb";

export async function actionNotifLikeDislikeReplyComment(
  userId: string | undefined,
  replyCommentOwnerId: string,
  replyCommentId: string,
  infoId: string,
  ep: string
) {
  const replyComment = await db.replyComment.findFirst({
    where: {
      id: replyCommentId,
    },
  });

  const isLiked = replyComment?.like.includes(userId as string);
  const isDisliked = replyComment?.dislike.includes(userId as string);

  const notification = await db.notification.findFirst({
    where: {
      commentId: replyCommentId,
      notifSenderId: userId,
      OR: [
        {
          notifMessage: "liked your comment reply",
        },
        {
          notifMessage: "disliked your comment reply",
        },
      ],
    },
  });

  if (replyCommentOwnerId === userId) return;

  if (isLiked) {
    if (!notification) {
      const data = await db.notification.create({
        data: {
          notifSenderId: userId as string,
          notifReceiverId: replyCommentOwnerId,
          commentId: replyCommentId,
          notifMessage: "liked your comment reply",
          url: `/watch/${infoId}?ep=${ep}`,
        },
      });
      return data;
    } else {
      const data = await db.notification.updateMany({
        where: {
          commentId: replyCommentId,
          notifSenderId: userId,
        },
        data: {
          notifMessage: "liked your comment reply",
        },
      });
      return data;
    }
  } else if (isDisliked) {
    if (!notification) {
      const data = await db.notification.create({
        data: {
          notifSenderId: userId as string,
          notifReceiverId: replyCommentOwnerId,
          commentId: replyCommentId,
          notifMessage: "disliked your comment reply",
          url: `/watch/${infoId}?ep=${ep}`,
        },
      });
      return data;
    } else {
      const data = await db.notification.updateMany({
        where: {
          commentId: replyCommentId,
          notifSenderId: userId,
        },
        data: {
          notifMessage: "disliked your comment reply",
        },
      });
      return data;
    }
  } else {
    const data = await db.notification.deleteMany({
      where: {
        commentId: replyCommentId,
        notifSenderId: userId,
      },
    });
    return data;
  }
}
