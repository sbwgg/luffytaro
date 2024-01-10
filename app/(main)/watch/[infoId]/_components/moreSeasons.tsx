import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MoreSeasonsProp {
  seasons: {
    id: string;
    name: string;
    title: string;
    poster: string;
    isCurrent: string;
  }[];
}

const MoreSeasons = ({ seasons }: MoreSeasonsProp) => {
  return (
    <>
      {seasons.length ? (
        <div className="mt-4 px-3 lg:px-10">
          <h1>MORE SEASONS</h1>
          <div className="gridSeason gap-2 mt-2">
            {seasons.map((season) => (
              <Link
                key={season.id}
                href={`/${season.id}`}
                className={cn(
                  "overflow-hidden",
                  season.isCurrent
                    ? "border border-red-500 text-red-500 font-semibold"
                    : ""
                )}
              >
                <div className="relative">
                  <div className="flex items-end text-sm justify-center absolute inset-0 bg-black/60 z-[30] p-2">
                    <p className="seasontitleEllipsis text-center italic text-xs">
                      {season.title}
                    </p>
                  </div>
                  <Image
                    src={season.poster}
                    alt="poster"
                    width={100}
                    height={100}
                    className="grayscale w-full h-[5rem] object-cover"
                    priority
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default MoreSeasons;
