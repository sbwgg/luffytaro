"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prismadb";

export default async function actionRemoveAnime(infoId: string) {
  try {
    await db.watchList.delete({
      where: {
        infoId,
      },
    });

    revalidatePath("/");
    revalidatePath(`/${infoId}`);
  } catch {
    throw new Error("Deleting Error");
  }
}
