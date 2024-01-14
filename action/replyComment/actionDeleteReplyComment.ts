"use server";

import db from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const actionDeleteReplyComment = async (replyCommentId: string) => {
  try {
    const data = await db.replyComment.delete({
      where: {
        id: replyCommentId,
      },
    });

    revalidatePath("/");
    return data;
  } catch (e) {
    console.log(e);
  }
};
