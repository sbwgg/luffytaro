"use server";

import db from "@/lib/prismadb";
import getUser from "@/utils/user";
import { revalidatePath } from "next/cache";

export async function actionChangeProfile(profile: string) {
  const user = await getUser();

  try {
    const d = await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        profile: profile,
      },
    });

    revalidatePath("/");
    return {
      message: d,
    };
  } catch (error) {
    console.log(error);
  }
}
