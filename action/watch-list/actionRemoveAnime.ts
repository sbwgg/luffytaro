"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prismadb";

export default async function actionRemoveAnime(id: string | undefined) {
  try {
    await db.watchList.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}
