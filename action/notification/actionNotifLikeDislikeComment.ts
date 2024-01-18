"use server";

import db from "@/lib/prismadb";

export async function actionNotifLikeDislikeComment(
  userId: string | undefined,
  commentOwnerId: string,
  commentId: string,
  infoId: string,
  ep: string
) {
  const comment = await db.comment.findFirst({
    where: {
      id: commentId,
    },
  });

  const isLiked = comment?.like.includes(userId as string);
  const isDisliked = comment?.dislike.includes(userId as string);

  const notification = await db.notification.findFirst({
    where: {
      commentId,
      notifSenderId: userId,
      OR: [
        {
          notifMessage: "liked your comment",
        },
        {
          notifMessage: "disliked your comment",
        },
      ],
    },
  });

  if (commentOwnerId === userId) return;

  if (isLiked) {
    if (!notification) {
      const data = await db.notification.create({
        data: {
          notifSenderId: userId as string,
          notifReceiverId: commentOwnerId,
          commentId,
          notifMessage: "liked your comment",
          url: `/watch/${infoId}?ep=${ep}`,
        },
      });
      return data;
    } else {
      const data = await db.notification.updateMany({
        where: {
          commentId,
          notifSenderId: userId,
        },
        data: {
          notifMessage: "liked your comment",
        },
      });
      return data;
    }
  } else if (isDisliked) {
    if (!notification) {
      const data = await db.notification.create({
        data: {
          notifSenderId: userId as string,
          notifReceiverId: commentOwnerId,
          commentId,
          notifMessage: "disliked your comment",
          url: `/watch/${infoId}?ep=${ep}`,
        },
      });
      return data;
    } else {
      const data = await db.notification.updateMany({
        where: {
          commentId,
          notifSenderId: userId,
        },
        data: {
          notifMessage: "disliked your comment",
        },
      });
      return data;
    }
  } else {
    const data = await db.notification.deleteMany({
      where: {
        notifSenderId: userId as string,
        commentId,
      },
    });

    return data;
  }
}
