import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaClosedCaptioning, FaMicrophone } from "react-icons/fa6";

interface MostPopularAnimeProp {
  mostPopular: {
    id: string;
    name: string;
    poster: string;
    jname: string;
    episodes: {
      sub: number;
      dub: number;
    };
    type: string;
  };
  length: number;
  index: number;
}

const MostPopularAnime = ({
  mostPopular,
  length,
  index,
}: MostPopularAnimeProp) => {
  return (
    <div
      className={cn(
        "flex gap-x-3 py-4",
        index === length ? "" : "border-b border-dashed border-zinc-700/80"
      )}
    >
      <div className="flex w-[3.8rem] h-[5rem] shrink-0 overflow-hidden">
        <Link href={`/${mostPopular.id}`}>
          <Image
            src={mostPopular.poster}
            alt="poster"
            width={500}
            height={300}
            priority
            className="w-full h-full object-cover rounded-sm"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-1 justify-center">
        <p className="seasontitleEllipsis text-sm hover:text-red-500">
          <Link href={`/${mostPopular.id}`}>{mostPopular.name}</Link>
        </p>
        <div className="flex items-center gap-2">
          {mostPopular.episodes.sub && (
            <p className="flex items-center gap-x-1 text-xs rounded">
              <FaClosedCaptioning /> {mostPopular.episodes.sub}
            </p>
          )}
          {mostPopular.episodes.dub && (
            <p className="flex items-center gap-x-1 text-xs rounded">
              <FaMicrophone /> {mostPopular.episodes.dub}
            </p>
          )}
          <span className="text-zinc-500">&#8226;</span>{" "}
          <span className="text-zinc-500 text-sm">{mostPopular.type}</span>
        </div>
      </div>
    </div>
  );
};

export default MostPopularAnime;
