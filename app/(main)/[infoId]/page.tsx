import React from "react";
import AnimeInfo from "./_components/animeInfo";
import Image from "next/image";
import "./_components/animeInfo.css";
import Link from "next/link";
import CharactersVoiceActors from "./_components/charactersVoiceActors";
import { cn } from "@/lib/utils";
import GridCardAnime from "@/components/gridCardAnime";
import RelatedAnime from "../../../components/relatedAnime";
import MostPopularAnime from "@/components/mostPopularAnime";

export interface AnimeInfoType {
  anime: {
    info: {
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
    moreInfo: {
      japanese: string;
      synonyms: string;
      aired: string;
      premiered: string;
      duration: string;
      status: string;
      malscore: string;
      genres: string[];
      studios: string;
      producers: string[];
    };
  };
  seasons: {
    id: string;
    name: string;
    title: string;
    poster: string;
    isCurrent: string;
  }[];
  mostPopularAnimes: {
    id: string;
    name: string;
    poster: string;
    jname: string;
    episodes: {
      sub: number;
      dub: number;
    };
    type: string;
  }[];
  relatedAnimes: {
    id: string;
    name: string;
    poster: string;
    jname: string;
    episodes: {
      sub: number;
      dub: number;
    };
    type: string;
  }[];
  recommendedAnimes: {
    id: string;
    name: string;
    poster: string;
    duration: string;
    type: string;
    rating: string | null;
    episodes: {
      sub: number;
      dub: number;
    };
  }[];
}

export interface MetaAnilistInfoType {
  isAdult: boolean;
  countryOfOrigin: string;
  image: string;
  popularity: number;
  color: string;
  cover: string;
  nextAiringEpisode: {
    airingTime: number;
    timeUntilAiring: number;
    episode: number;
  };
  totalEpisodes: number;
  currentEpisode: number;
  characters: {
    id: number;
    role: string;
    name: {
      first: string;
      role: string;
      full: string;
      native: string;
      userPreffered: string;
    };
    image: string;
    voiceActors: {
      id: number;
      language: string;
      name: {
        first: string;
        last: string;
        full: string;
        native: string;
        userPreffered: string;
      };
      image: string;
    }[];
  }[];
}

const getAnimeInfo = async (infoId: string) => {
  const res = await fetch(
    `${process.env.ANIWATCH_URL}/anime/info/?id=${infoId}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch anime info");
  }
  return res.json();
};

const getMetaAnilistInfo = async (alID: string) => {
  const res = await fetch(
    `${process.env.CONSUMET_URL}/meta/anilist/info/${alID}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    return null;
  }
  return res.json();
};

export const generateMetadata = async ({
  params,
}: {
  params: { infoId: string };
}) => {
  const animeInfo: AnimeInfoType = await getAnimeInfo(params.infoId);

  return {
    title: `${animeInfo.anime.info.name} Sub/Dub for free on LuffyTaro`,
  };
};

const MoreDetailPage = async ({ params }: { params: { infoId: string } }) => {
  const animeInfo: AnimeInfoType = await getAnimeInfo(params.infoId);
  const { alID }: { alID: string } = await fetch(
    `${process.env.CONSUMET_URL}/anime/zoro/info?id=${params.infoId}`,
    {
      next: {
        revalidate: 60,
      },
    }
  ).then((res) => res.json());
  const metaAnilistInfo: MetaAnilistInfoType = await getMetaAnilistInfo(alID);

  return (
    <div>
      <AnimeInfo
        animeInfo={animeInfo}
        nextAiringEpisode={metaAnilistInfo?.nextAiringEpisode}
      />

      {animeInfo.seasons.length ? (
        <div className="mt-10 px-3 lg:px-10">
          <h1 className="sm:text-xl">
            <span className="p-1 mr-3 bg-red-500 rounded-lg" />
            MORE SEASONS
          </h1>

          <div className="seasonGrid gap-2 mt-5">
            {animeInfo.seasons.map((season) => (
              <Link
                key={season.id}
                href={`/${season.id}`}
                className={cn(
                  "overflow-hidden rounded-lg",
                  season.isCurrent
                    ? "border border-red-500 text-red-500 font-semibold"
                    : ""
                )}
              >
                <div className="relative">
                  <div className="flex items-end text-sm justify-center absolute inset-0 bg-black/50 z-[30] p-3">
                    <p className="seasontitleEllipsis text-center">
                      {season.title}
                    </p>
                  </div>
                  <Image
                    src={season.poster}
                    alt="poster"
                    width={100}
                    height={100}
                    className="grayscale w-full h-[6rem] object-cover"
                    priority
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {metaAnilistInfo && metaAnilistInfo?.characters?.length ? (
        <div className="mt-10 px-3 lg:px-10">
          <CharactersVoiceActors characters={metaAnilistInfo?.characters} />
        </div>
      ) : null}

      <div className="lg:flex gap-x-4 px-3 lg:px-10 mt-10">
        <div className="flex-1">
          <h1 className="sm:text-xl cursor-pointer">
            <span className="p-1 mr-3 bg-red-500 rounded-lg" />
            RECOMMEND FOR YOU
          </h1>

          <div className="gridCard gap-x-2 gap-y-8 mt-5">
            {animeInfo?.recommendedAnimes.map((recommend) => (
              <GridCardAnime key={recommend.id} anime={recommend} />
            ))}
          </div>
        </div>

        <div className="basis-[19.5rem] lg:mt-0 mt-10">
          {animeInfo.relatedAnimes.length ? (
            <div>
              <h1 className="sm:text-xl cursor-pointer">
                <span className="p-1 mr-3 bg-red-500 rounded-lg" />
                RELATED ANIME
              </h1>

              <RelatedAnime relatedAnime={animeInfo.relatedAnimes} />
            </div>
          ) : null}

          {animeInfo.mostPopularAnimes.length ? (
            <div className="mt-10">
              <h1 className="sm:text-xl cursor-pointer">
                <span className="p-1 mr-3 bg-red-500 rounded-lg" />
                MOST POPULAR
              </h1>

              <div className="mt-5 bg-zinc-900 px-4 py-2 rounded-xl">
                {animeInfo.mostPopularAnimes.map((mostPopular, i) => (
                  <MostPopularAnime
                    key={mostPopular.id}
                    mostPopular={mostPopular}
                    index={i}
                    length={animeInfo.mostPopularAnimes.length - 1}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MoreDetailPage;
