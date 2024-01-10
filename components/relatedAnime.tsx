"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaClosedCaptioning, FaMicrophone } from "react-icons/fa6";

interface RelatedAnimeProp {
  relatedAnime: {
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
}

const RelatedAnime = ({ relatedAnime }: RelatedAnimeProp) => {
  const [showmore, setShowmore] = useState<number | undefined>(6);

  return (
    <div className="mt-5 bg-zinc-900/50 px-4 py-2">
      {relatedAnime?.slice(0, showmore).map((related, i) => (
        <div
          key={related.id}
          className={cn(
            "flex gap-x-3 py-4",
            i !== relatedAnime.slice(0, showmore).length - 1
              ? "border-b border-dashed border-zinc-700/80"
              : ""
          )}
        >
          <div className="flex w-[3.8rem] h-[5rem] shrink-0 rounded-sm overflow-hidden">
            <Link href={`/${related.id}`}>
              <Image
                src={related.poster}
                alt="poster"
                width={500}
                height={300}
                priority
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <p className="seasontitleEllipsis text-sm hover:text-red-500">
              <Link href={`/${related.id}`}>{related.name}</Link>
            </p>
            <div className="flex items-center gap-2">
              {related.episodes.sub && (
                <p className="flex items-center gap-x-1 text-xs rounded">
                  <FaClosedCaptioning /> {related.episodes.sub}
                </p>
              )}
              {related.episodes.dub && (
                <p className="flex items-center gap-x-1 text-xs rounded">
                  <FaMicrophone /> {related.episodes.dub}
                </p>
              )}
              <span className="text-zinc-500">&#8226;</span>{" "}
              <span className="text-zinc-500 text-sm">{related.type}</span>
            </div>
          </div>
        </div>
      ))}

      {relatedAnime.length > 6 && (
        <div className="flex py-3">
          <button
            onClick={() => setShowmore((prev) => (prev === 6 ? undefined : 6))}
            className="bg-red-500 flex-1 p-3 text-sm"
          >
            {showmore ? "Show more" : "Show less"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RelatedAnime;
