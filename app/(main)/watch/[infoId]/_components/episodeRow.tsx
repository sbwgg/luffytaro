"use client";

import { EpisodeType } from "@/app/(main)/[infoId]/_components/animeInfo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Element, scroller } from "react-scroll";

interface EpisodeRowProp {
  animeEpisodes: EpisodeType;
  ep: string;
  infoId: string;
}

export default function EpisodeRow({
  animeEpisodes,
  ep,
  infoId,
}: EpisodeRowProp) {
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

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm">EPISODES:</p>

        {animeEpisodes.episodes.length > 100 && (
          <select
            onChange={(e) => setEpshowed(parseInt(e.target.value))}
            value={epshowed === undefined ? defaultValue : epshowed}
            className="bg-zinc-900 text-sm"
          >
            {dropDownEp.map((d) => (
              <option key={d.value} value={d.value}>
                EP: {d.first > 10 ? d.first : `0${d.first}`}-{d.last}
              </option>
            ))}
          </select>
        )}
      </div>

      <div id="scrollContainer" className="relative flex-1 overflow-auto">
        <div className="lg:absolute inset-0 lg:pr-2 max-h-[17.4rem]">
          <div className="gridEpisodes gap-1">
            {chunkEpisodes[
              epshowed === undefined ? defaultValue : epshowed
            ]?.map((episode) => (
              <EpisodeNumberCard
                key={episode.episodeId}
                episode={episode}
                ep={ep}
                infoId={infoId}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function EpisodeNumberCard({
  episode,
  ep,
  infoId,
}: {
  episode: {
    title: string;
    episodeId: string;
    number: number;
    isFiller: string;
  };
  ep: string;
  infoId: string;
}) {
  const episodeWatching = episode.episodeId === `${infoId}?ep=${ep}`;

  useEffect(() => {
    if (episode.episodeId === `${infoId}?ep=${ep}`) {
      scroller.scrollTo(episode.episodeId, {
        duration: 300,
        smooth: true,
        containerId: "scrollContainer",
      });
    }
  }, [episode.episodeId, infoId, ep]);

  return (
    <Link href={`/watch/${episode.episodeId}`} key={episode.episodeId}>
      <Element
        title={
          episode.isFiller
            ? `Filler Episodes ${episode.number}`
            : `Episodes ${episode.number}`
        }
        name={episode.episodeId}
        className={cn(
          "border border-zinc-800 p-[.4rem] text-[13.5px] hover:bg-red-600 hover:text-zinc-300 md:text-sm text-center text-zinc-500",
          episodeWatching && "bg-red-600 hover:bg-red-600 text-zinc-300",
          episodeWatching &&
            episode.isFiller &&
            "bg-gradient-to-tr from-pink-700 to-pink-500",
          episode.isFiller && "bg-pink-600/60 hover:bg-pink-700"
        )}
      >
        {episode.number}
      </Element>
    </Link>
  );
}
