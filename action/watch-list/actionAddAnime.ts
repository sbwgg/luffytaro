"use server";

import db from "@/lib/prismadb";
import getUser from "@/lib/user";
import { revalidatePath } from "next/cache";

type AnimeInfoType = {
  id: string;
  name: string;
  poster: string;
  description: string;
  stats: {
    rating: string;
    quality: string;
    episodes: {
      sub: number;
      dub: number;
    };
    type: string;
    duration: string;
  };
};

export default async function actionAddAnime(
  status: string,
  animeInfo: AnimeInfoType
) {
  const user = await getUser();

  const isAlreadyAdded = await db.watchList.findUnique({
    where: {
      infoId: animeInfo.id,
    },
  });

  if (!user) {
    return {
      error: "Sign in to add " + animeInfo.name + " to your watch list.",
    };
  }

  if (isAlreadyAdded) {
    return { error: "This anime is already in your watch list" };
  }

  try {
    await db.watchList.create({
      data: {
        infoId: animeInfo.id,
        name: animeInfo.name,
        poster: animeInfo.poster,
        status,
        userId: user?.id as string,
        dub: animeInfo.stats.episodes.dub,
        sub: animeInfo.stats.episodes.sub,
        duration: animeInfo.stats.duration,
        quality: animeInfo.stats.quality,
        rating: animeInfo.stats.rating,
        type: animeInfo.stats.type,
      },
    });

    revalidatePath("/");
    revalidatePath(`/${animeInfo.id}`);
  } catch {
    throw new Error("Adding anime to watch list error");
  }
}
