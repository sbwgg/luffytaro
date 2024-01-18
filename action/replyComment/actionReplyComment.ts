"use server";

import db from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const actionReplyComment = async (
  formData: FormData,
  commentId: string,
  userId: string | undefined,
  commentOwnerId: string,
  infoId: string,
  ep: string,
  username?: string
) => {
  const replyComment = formData.get("replyComment") as string;
  const isSpoiler = formData.get("spoiler") as string;
  const spoiler = !isSpoiler ? false : true;

  try {
    const data = await db.replyComment.create({
      data: {
        replyComment,
        commentId,
        spoiler,
        userId: userId as string,
        replyTo: username,
        episodeId: ep,
      },
      include: {
        user: {
          select: {
            username: true,
            id: true,
            profile: true,
          },
        },
      },
    });

    if (commentOwnerId !== userId) {
      await db.notification.create({
        data: {
          notifSenderId: userId as string,
          notifReceiverId: commentOwnerId,
          commentId: data.id,
          notifMessage: !username
            ? "replied to your comment"
            : "replied to your comment reply",
          url: `/watch/${infoId}?ep=${ep}`,
        },
      });
    }

    revalidatePath("/");
    return data;
  } catch (error) {
    console.log(error);
  }
};
