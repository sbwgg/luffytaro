"use server";

import db from "@/lib/prismadb";
import getUser from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function actionChangeProfile(url: string) {
  const user = await getUser();

  try {
    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        profile: url,
      },
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/profile");
}
