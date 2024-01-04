import React from "react";
import SpotlightAnime from "./_components/spotlightAnime";
import "./_components/home.css";
import TrendingAnime from "./_components/trendingAnime";
import GridCardAnime from "@/components/gridCardAnime";
import Top10Anime from "./_components/top10Anime";
import { cn } from "@/lib/utils";
import EstimatedSchedule from "./_components/estimatedSchedule";
import dynamic from "next/dynamic";
import Link from "next/link";
import Category from "@/components/category";
const ContinueWatching = dynamic(
  () => import("./_components/continueWatching"),
  { ssr: false }
);

export interface AnimeHome {
  spotlightAnimes: {
    rank: number;
    id: string;
    name: string;
    description: string;
    poster: string;
    jname: string;
    episodes: {
      sub: number;
      dub: number;
    };
    otherInfo: string[];
  }[];
  trendingAnimes: {
    rank: number;
    name: string;
    id: string;
    poster: string;
  }[];
  latestEpisodeAnimes: {
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
  }[];
  topUpcomingAnimes: {
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
  }[];
  top10Animes: {
    today: {
      id: string;
      rank: number;
      name: string;
      poster: string;
      episodes: {
        sub: number;
        dub: number;
      };
    }[];
    week: {
      id: string;
      rank: number;
      name: string;
      poster: string;
      episodes: {
        sub: number;
        dub: number;
      };
    }[];
    month: {
      id: string;
      rank: number;
      name: string;
      poster: string;
      episodes: {
        sub: number;
        dub: number;
      };
    }[];
  };
  topAiringAnimes: {
    id: string;
    name: string;
    jname: string;
    poster: string;
    otherInfo: string[];
  }[];
  genres: string[];
}

async function getAnimeHome() {
  const res = await fetch(`${process.env.ANIWATCH_URL}/anime/home`, {
    next: {
      revalidate: 60,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch anime home");
  }
  return res.json();
}

const HomePage = async () => {
  const animeHome: AnimeHome = await getAnimeHome();

  const greenGenre = [0, 5, 10, 15, 20, 25, 30, 35, 40];
  const pinkGenre = [1, 6, 11, 16, 21, 26, 31, 36, 41];
  const blueGenre = [2, 7, 12, 17, 22, 27, 32, 37, 42];
  const yellowGenre = [3, 8, 13, 18, 23, 28, 33, 38, 43];
  const whiteGnre = [4, 9, 14, 19, 24, 29, 34, 39, 44];

  return (
    <main>
      <SpotlightAnime spotlight={animeHome.spotlightAnimes} />
      <ContinueWatching />

      <div className="px-3 lg:px-10 mt-5">
        <h1 className="text-xl">
          <span className="p-1 mr-3 bg-red-500 rounded-lg" />
          Trending animes
        </h1>

        <TrendingAnime trending={animeHome.trendingAnimes} />
      </div>

      <div className="lg:flex gap-x-4 px-3 lg:px-10 mt-10">
        <div className="flex-1">
          <h1 className="text-xl">
            <Link href={`/category/recently-updated`}>
              <span className="p-1 mr-3 bg-red-500  rounded-lg" />
              Latest episode &#62;
            </Link>
          </h1>

          <div className="gridCard gap-x-2 gap-y-8 mt-5">
            {animeHome.latestEpisodeAnimes.slice(0, 10).map((latest) => (
              <GridCardAnime key={latest.id} anime={latest} />
            ))}
          </div>

          <h1 className="text-xl mt-10">
            <Link href={`/category/top-upcoming`}>
              <span className="p-1 mr-3 bg-red-500  rounded-lg" />
              Top upcoming &#62;
            </Link>
          </h1>

          <div className="gridCard gap-x-2 gap-y-8 mt-5">
            {animeHome.topUpcomingAnimes.slice(0, 10).map((topUpcoming) => (
              <GridCardAnime key={topUpcoming.id} anime={topUpcoming} />
            ))}
          </div>
        </div>

        <div className="lg:w-[19.5rem]">
          <Top10Anime top10anime={animeHome.top10Animes} />

          <Category />
        </div>
      </div>

      <div className="px-3 lg:px-10 mt-10">
        <h1 className="text-xl mt-10">
          <span className="p-1 mr-3 bg-red-500  rounded-lg" />
          Genre
        </h1>

        <div className="flex items-center gap-1 flex-wrap mt-5">
          {animeHome.genres.map((g, i) => (
            <Link
              href={`/genre/${g.toLowerCase()}`}
              className={cn(
                "p-2 rounded text-sm",
                greenGenre.includes(i) && "bg-green-700",
                pinkGenre.includes(i) && "bg-pink-700",
                blueGenre.includes(i) && "bg-blue-700",
                yellowGenre.includes(i) && "bg-yellow-700",
                whiteGnre.includes(i) && "bg-white text-black"
              )}
              key={g}
            >
              {g}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-3 lg:px-10 mt-10">
        <h1 className="text-xl">
          <span className="p-1 mr-3 bg-red-500 rounded-lg" />
          Estimated schedule
        </h1>

        <EstimatedSchedule />
      </div>
    </main>
  );
};

export default HomePage;
