"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prismadb";

export default async function actionRemoveAnime(
  id: string | undefined,
  path: string
) {
  try {
    await db.watchList.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath(`/${path}`);
}
