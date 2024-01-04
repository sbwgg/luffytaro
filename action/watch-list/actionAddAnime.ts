"use server";

import db from "@/lib/prismadb";
import getUser from "@/utils/user";
import { revalidatePath } from "next/cache";

interface anime {
  poster: string;
  name: string;
  rating: string;
  quality: string;
  sub: number;
  dub: number;
  type: string;
  infoId: string;
  duration: string;
}

export default async function actionAddAnime(anime: anime, status: string) {
  const user = await getUser();

  try {
    await db.watchList.create({
      data: {
        userId: user?.id as string,
        ...anime,
        status,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}
