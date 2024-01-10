"use client";

import Top10AnimeCard from "@/app/(main)/(route)/_components/top10animeCard";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface Top10AnimeProp {
  top10anime: {
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
}

interface DefaultTop {
  id: string;
  rank: number;
  name: string;
  poster: string;
  episodes: {
    sub: number;
    dub: number;
  };
}

const Top10Anime = ({ top10anime }: Top10AnimeProp) => {
  const [defaultTop, setDefaultTop] = useState<DefaultTop[]>(top10anime.today);
  const [topDay, setTopDay] = useState("today");

  return (
    <>
      <div className="flex items-center justify-between mb-5 lg:mt-0 mt-10">
        <h1 className="sm:text-xl">
          <span className="p-1 mr-3 bg-red-500 rounded-lg" />
          TOP 10
        </h1>

        <div>
          <button
            onClick={() => {
              setDefaultTop(top10anime.today);
              setTopDay("today");
            }}
            className={cn(
              "p-2 text-sm duration-300",
              topDay === "today" ? "bg-red-500" : "bg-zinc-800"
            )}
          >
            Today
          </button>
          <button
            onClick={() => {
              setDefaultTop(top10anime.week);
              setTopDay("week");
            }}
            className={cn(
              "p-2 text-sm duration-300",
              topDay === "week" ? "bg-red-500" : "bg-zinc-800"
            )}
          >
            Week
          </button>
          <button
            onClick={() => {
              setDefaultTop(top10anime.month);
              setTopDay("month");
            }}
            className={cn(
              "p-2 text-sm duration-300",
              topDay === "month" ? "bg-red-500" : "bg-zinc-800"
            )}
          >
            Month
          </button>
        </div>
      </div>

      {defaultTop.length < 1 ? (
        <div className="p-3 bg-zinc-900/60 text-center">No results</div>
      ) : (
        <div className="p-3 bg-zinc-900/60">
          {defaultTop.map((top, i) => (
            <Top10AnimeCard key={top.id} top={top} index={i} />
          ))}
        </div>
      )}
    </>
  );
};

export default Top10Anime;
