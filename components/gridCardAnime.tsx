import Image from "next/image";
import React from "react";
import { FaClosedCaptioning } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa";
import Link from "next/link";
import { AnimeInfoType } from "@/app/(main)/[infoId]/page";

interface LatestEpisodeProp {
  anime: {
    id: string;
    name: string;
    poster: string;
    duration: string;
    type: string;
    rating: string | null;
    episodes: {
      sub: number | null;
      dub: number | null;
    };
  };
}

const GridCardAnime = async ({ anime }: LatestEpisodeProp) => {
  const animeInfo: AnimeInfoType = await fetch(
    `${process.env.ANIWATCH_URL}/anime/info?id=${anime.id}`,
    {
      next: {
        revalidate: 60,
      },
    }
  ).then((res) => res.json());

  return (
    <div>
      <Link href={`/${anime.id}`}>
        <div className="relative w-full sm:h-[16rem] h-[14rem]">
          <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          {anime.rating && (
            <p className="absolute right-1 top-1 text-xs p-1 px-2 bg-red-500 rounded">
              {anime.rating}
            </p>
          )}
          <div className="flex items-center gap-x-2 absolute bottom-2 left-2">
            {anime.episodes.sub && (
              <p className="flex items-center gap-x-1 text-xs">
                <FaClosedCaptioning /> {anime.episodes.sub}
              </p>
            )}
            {anime.episodes.dub && (
              <p className="flex items-center gap-x-1 text-xs">
                <FaMicrophone /> {anime.episodes.dub}
              </p>
            )}
          </div>
          <Image
            src={anime.poster}
            alt="poster"
            width={400}
            height={300}
            priority
            className="w-full h-full object-cover shrink-0"
          />
        </div>
      </Link>
      <div className="mt-2">
        <p className="truncate hover:text-red-500 text-sm">
          <Link href={`/${anime.id}`}>{anime.name}</Link>
        </p>
        {animeInfo?.anime?.info?.description && (
          <p className="ellip my-2 text-[13px] text-zinc-400">
            {animeInfo?.anime?.info?.description}
          </p>
        )}
        <p className="flex items-center gap-x-2 text-zinc-400 mt-2 text-xs">
          <span className="truncate">{anime.duration}</span> &#x2022;{" "}
          <span className="truncate">{anime.type}</span>
        </p>
      </div>
    </div>
  );
};

export default GridCardAnime;
