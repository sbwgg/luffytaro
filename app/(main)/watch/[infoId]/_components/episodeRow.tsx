"use client";

import { EpisodeType } from "@/app/(main)/[infoId]/_components/animeInfo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";

interface EpisodeRowProp {
  animeEpisodes: EpisodeType;
  ep: string;
}

const EpisodeRow = ({ animeEpisodes, ep }: EpisodeRowProp) => {
  const [epshowed, setEpshowed] = useState<number | undefined>(undefined);
  const { episodes } = animeEpisodes;

  const chunkEpisodes = [];
  for (let i = 0; i < episodes?.length; i += 100) {
    const chunk = episodes?.slice(i, i + 100);
    chunkEpisodes?.push(chunk);
  }

  const dropDownEp = [];
  for (let i = 0; i < chunkEpisodes.length; i++) {
    dropDownEp.push({
      value: i,
      first: chunkEpisodes[i][0].number,
      last: chunkEpisodes[i][chunkEpisodes[i].length - 1].number,
      episodesId: chunkEpisodes[i],
    });
  }

  const defaultValue = dropDownEp.findIndex((item) =>
    item.episodesId.some((item) => item.episodeId.split("=")[1] === ep)
  );

  const isFiller = animeEpisodes.episodes.find(
    (filler) => filler.episodeId.split("=")[1] === ep
  )?.isFiller;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="italic text-sm">Episodes:</p>

        {animeEpisodes.episodes.length > 100 && (
          <select
            onChange={(e) => setEpshowed(parseInt(e.target.value))}
            value={epshowed === undefined ? defaultValue : epshowed}
            className="bg-zinc-900 italic text-sm"
          >
            {dropDownEp.map((d) => (
              <option key={d.value} value={d.value}>
                EP: {d.first > 10 ? d.first : `0${d.first}`}-{d.last}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="relative flex-1 overflow-auto">
        <div className="lg:absolute inset-0 lg:pr-2 max-h-[17.4rem]">
          <div className="gridEpisodes gap-1">
            {chunkEpisodes[
              epshowed === undefined ? defaultValue : epshowed
            ]?.map((episode) => (
              <Fragment key={episode.episodeId}>
                <Link
                  href={`/watch/${episode.episodeId}`}
                  className={cn(
                    "bg-zinc-900 hover:bg-zinc-700 p-[.5rem] text-sm text-center rounded ",
                    episode.episodeId.split("=")[1] === ep &&
                      "bg-red-500 hover:bg-red-500",
                    episode.episodeId.split("=")[1] === ep &&
                      isFiller &&
                      "bg-gradient-to-tr from-orange-700 to-orange-400",
                    episode.isFiller && "bg-orange-300/30 hover:bg-orange-600"
                  )}
                >
                  {episode.number}
                </Link>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EpisodeRow;
