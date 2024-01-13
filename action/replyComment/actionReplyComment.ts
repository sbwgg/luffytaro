"use server";

import db from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const actionReplyComment = async (
  formData: FormData,
  commentId: string,
  userId?: string,
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

    revalidatePath("/");
    return data;
  } catch (error) {
    console.log(error);
  }
};
