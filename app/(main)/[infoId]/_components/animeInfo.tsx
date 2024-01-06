import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaClosedCaptioning } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa";
import { IoMdPlay } from "react-icons/io";
import { AnimeInfoType } from "../page";
import NextEpisodeTime from "@/components/nextEpisodeTime";
import Description from "./description";
import db from "@/lib/prismadb";
import AddToListButton from "./addToListButton";
import getUser from "@/utils/user";

interface AnimeInfoProp {
  animeInfo: AnimeInfoType;
  nextAiringEpisode: {
    airingTime: number;
    timeUntilAiring: number;
    episode: number;
  };
}

export interface EpisodeType {
  totalEpisodes: number;
  episodes: {
    title: string;
    episodeId: string;
    number: number;
    isFiller: string;
  }[];
}

const AnimeInfo = async ({ animeInfo, nextAiringEpisode }: AnimeInfoProp) => {
  const episode: EpisodeType = await fetch(
    `${process.env.ANIWATCH_URL}/anime/episodes/${animeInfo.anime.info.id}`,
    { cache: "no-store" }
  ).then((res) => res.json());
  const user = await getUser();
  const watchList =
    user &&
    (await db.watchList.findMany({
      where: {
        userId: user?.id,
      },
    }));

  return (
    <div className="flex lg:flex-row flex-col gap-x-10 px-3 lg:px-10 xl:px-24 pt-28">
      <div className="md:flex gap-x-6 flex-1">
        <div className="shrink-0 md:mb-0 mb-8 flex items-center md:items-start justify-center">
          <div className="relative xl:w-[12rem] xl:h-[12rem] w-[10rem] h-[10rem] rounded-full">
            {animeInfo?.anime?.info?.stats?.rating === "R+" ||
              (animeInfo?.anime?.info?.stats?.rating === "R" && (
                <span className="flex items-center justify-center absolute top-2 right-4 bg-red-500 text-xs rounded-full h-[2rem] w-[2rem]">
                  18+
                </span>
              ))}
            <Image
              src={animeInfo?.anime?.info?.poster}
              alt="poster"
              width={400}
              height={100}
              priority
              className="xl:w-[12rem] xl:h-[12rem] w-[10rem] h-[10rem] rounded-full object-cover shrink-0 m-auto"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="hidden xl:flex items-center gap-x-2 text-zinc-400 mb-3 text-sm">
            <Link href={`/`} className="hover:text-red-500">
              Home
            </Link>
            &#x2022;
            <p>{animeInfo?.anime?.info?.stats.type}</p>
            &#x2022;
            <p>{animeInfo?.anime?.info?.name}</p>
          </div>
          <p className="text-2xl sm:text-3xl xl:text-4xl text-center md:text-start font-semibold mb-4">
            {animeInfo?.anime?.info?.name}
          </p>
          <div className="flex items-center md:justify-start justify-center gap-x-3 mb-4 text-sm">
            <p className="flex items-center gap-x-1">
              {animeInfo?.anime?.info?.stats?.rating}
            </p>
            <p className="flex items-center gap-x-1 text-xs bg-red-500 p-1 px-2 rounded">
              {animeInfo?.anime?.info?.stats?.quality}
            </p>
            {animeInfo?.anime?.info.stats.episodes.sub && (
              <p className="flex items-center gap-x-1">
                <FaClosedCaptioning />
                {animeInfo?.anime?.info?.stats?.episodes.sub}
              </p>
            )}
            {animeInfo?.anime?.info.stats.episodes.dub && (
              <p className="flex items-center gap-x-1">
                <FaMicrophone />
                {animeInfo?.anime?.info?.stats?.episodes.dub}
              </p>
            )}
            <p className="flex items-center gap-x-1">
              {animeInfo?.anime?.info?.stats?.type}
            </p>
            <p className="flex items-center gap-x-1">
              {animeInfo?.anime?.info?.stats?.duration}
            </p>
          </div>

          <div className="flex items-center md:justify-start justify-center gap-x-2 mb-5">
            {animeInfo.anime.moreInfo.status !== "Not yet aired" && (
              <Link
                href={`/watch/${episode.episodes[0]?.episodeId}`}
                className="flex items-center gap-x-1 px-4 py-2 rounded-full md:rounded bg-red-500"
              >
                <IoMdPlay />
                Watch now
              </Link>
            )}
            <AddToListButton
              watchList={watchList}
              animeInfo={animeInfo}
              user={user}
            />
          </div>

          <div className="text-[14px]">
            <Description description={animeInfo.anime.info.description} />

            <p className="mt-5 text-gray-300 italic">
              LuffyTaro is the best site to watch {animeInfo?.anime?.info?.name}{" "}
              SUB online, or you can even watch {animeInfo?.anime?.info?.name}{" "}
              DUB in HD quality. You can also find Studio Pierrot anime on
              LuffyTaro website.
            </p>

            <div className="mt-5">
              {nextAiringEpisode ? (
                <NextEpisodeTime nextAiringEpisode={nextAiringEpisode} />
              ) : (
                <>
                  <p>Next episode: None</p>
                  <p>Aired time: Finish airing</p>
                  <p>Time remaining: None</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="basis-[13rem] text-sm lg:mt-0 mt-8">
        <p className="mb-2">
          <span className="font-semibold">Japanese:</span>{" "}
          {animeInfo?.anime?.moreInfo?.japanese}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Synonyms:</span>{" "}
          {animeInfo?.anime?.moreInfo?.synonyms}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Aired:</span>{" "}
          {animeInfo?.anime?.moreInfo?.aired}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Premiered:</span>{" "}
          {animeInfo?.anime?.moreInfo?.premiered}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Duration:</span>{" "}
          {animeInfo?.anime?.moreInfo?.duration}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Status:</span>{" "}
          {animeInfo?.anime?.moreInfo?.status}
        </p>
        <p className="mb-2">
          <span className="font-semibold">MAL Score:</span>{" "}
          {animeInfo?.anime?.moreInfo?.malscore}
        </p>

        <div className="flex items-center gap-1 flex-wrap mt-3 border-y border-dashed border-zinc-800 py-3">
          <span className="font-semibold">Genres:</span>{" "}
          {animeInfo?.anime?.moreInfo?.genres.map((g) => (
            <span className="px-2 py-1 rounded-full text-xs border" key={g}>
              {g}
            </span>
          ))}
        </div>

        <p className="mt-3">
          <span className="font-semibold">Studios:</span>{" "}
          {animeInfo?.anime?.moreInfo?.studios}
        </p>
        <p className="mt-3">
          <span className="font-semibold">Producers:</span>{" "}
          {animeInfo?.anime?.moreInfo?.producers?.join(", ")}
        </p>
      </div>
    </div>
  );
};

export default AnimeInfo;
