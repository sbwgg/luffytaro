"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prismadb";

export default async function actionRemoveAnime(
  id: string | undefined,
  path: string | undefined
) {
  try {
    const data = await db.watchList.delete({
      where: {
        id,
      },
    });

    revalidatePath(`/${path}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}
