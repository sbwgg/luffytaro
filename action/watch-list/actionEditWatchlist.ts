"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prismadb";

export default async function actionEditWatchlist(id: string, status: string) {
  try {
    const d = await db.watchList.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    revalidatePath("/");
    return d;
  } catch (error) {
    console.log(error);
  }
}
