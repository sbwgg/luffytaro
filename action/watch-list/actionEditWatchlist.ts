"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prismadb";

export default async function actionEditWatchlist(
  id: string | undefined,
  status: string,
  path: string
) {
  try {
    const data = await db.watchList.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    revalidatePath(`/${path}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}
