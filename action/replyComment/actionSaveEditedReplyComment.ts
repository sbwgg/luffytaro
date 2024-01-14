"use server";

import db from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const actionSaveEditedReplyComment = async (
  formData: FormData,
  replyCommentId?: string
) => {
  const editedReplyComment = formData.get("editedReplyComment") as string;

  try {
    const data = await db.replyComment.update({
      where: {
        id: replyCommentId,
      },
      data: {
        replyComment: editedReplyComment,
        isEdited: true,
      },
    });

    revalidatePath("/");
    return data;
  } catch (error) {
    console.log(error);
  }
};
