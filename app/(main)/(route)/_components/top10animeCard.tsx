import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaClosedCaptioning, FaMicrophone } from "react-icons/fa6";

interface Top10AnimeCardProp {
  top: {
    id: string;
    rank: number;
    name: string;
    poster: string;
    episodes: {
      sub: number;
      dub: number;
    };
  };
  index: number;
}

const Top10AnimeCard = ({ top, index }: Top10AnimeCardProp) => {
  return (
    <div
      className={cn(
        "flex p-3 overflow-hidden",
        index >= 9 ? "" : "border-b border-dashed border-zinc-600/50"
      )}
    >
      <p
        className={cn(
          "w-[3rem] flex items-center text-xl shrink-0 font-semibold",
          top.rank <= 3 ? "text-red-500" : ""
        )}
      >
        <span className={cn(top.rank <= 3 ? "border-b-2 border-red-500" : "")}>
          {top.rank < 10 ? `0${top.rank}` : top.rank}
        </span>
      </p>
      <div className="flex gap-x-2 flex-1">
        <div className="shrink-0">
          <Link href={`/${top.id}`}>
            <Image
              src={top.poster}
              alt="poster"
              width={100}
              height={100}
              quality={100}
              priority
              className="w-[4rem] h-[5.5rem] object-cover rounded-md shrink-0"
            />
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 space-y-2">
          <p className="titleEllipsis text-sm hover:text-red-500">
            <Link href={`/${top.id}`}>{top.name}</Link>
          </p>
          <div className="flex items-center gap-x-3">
            {top.episodes.sub && (
              <p className="flex items-center gap-x-1 text-xs">
                <FaClosedCaptioning /> {top.episodes.sub}
              </p>
            )}
            {top.episodes.dub && (
              <p className="flex items-center gap-x-1 text-xs">
                <FaMicrophone /> {top.episodes.dub}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top10AnimeCard;
