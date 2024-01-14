"use server";

import db from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const actionSaveEditedComment = async (
  formData: FormData,
  commentId: string
) => {
  const editedComment = formData.get("editedComment") as string;

  try {
    const data = await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        comment: editedComment,
        isEdited: true,
      },
    });

    revalidatePath("/");
    return data;
  } catch (error) {
    console.log(error);
  }
};
