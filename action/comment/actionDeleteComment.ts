"use server";

import db from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const actionDeleteComment = async (commentId: string) => {
  try {
    const deleteComment = await db.comment.delete({
      where: {
        id: commentId,
      },
    });

    revalidatePath("/");
    return deleteComment;
  } catch (e) {
    console.log(e);
  }
};
