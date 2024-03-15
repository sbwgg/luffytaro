"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prismadb";

export default async function actionEditWatchlist(
  infoId: string,
  status: string
) {
  try {
    await db.watchList.update({
      where: {
        infoId,
      },
      data: {
        status,
      },
    });

    revalidatePath("/");
    revalidatePath(`/${infoId}`);
  } catch {
    throw new Error("Editing watchlist Error");
  }
}
