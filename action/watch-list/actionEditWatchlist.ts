"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prismadb";

export default async function actionEditWatchlist(
  id: string | undefined,
  status: string,
  path: string
) {
  try {
    await db.watchList.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath(`/${path}`);
}
