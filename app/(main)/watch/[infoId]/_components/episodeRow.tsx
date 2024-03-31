"use client";

import { useEffect, useState } from "react";
import { Element, scroller } from "react-scroll";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EpisodeType } from "@/app/(main)/[infoId]/_components/animeInfo";

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
  const [searchValue, setSearchValue] = useState<string>("");

  const { episodes } = animeEpisodes;

  useEffect(() => {
    // Highlight episode if search value matches
    if (searchValue !== "") {
      const matchedEpisode = episodes.find(
        (episode) => episode.number === parseInt(searchValue)
      );
      if (matchedEpisode) {
        const matchedIndex = episodes.indexOf(matchedEpisode);
        setEpshowed(Math.floor(matchedIndex / 100));
      }
    }
  }, [searchValue, episodes]);

  // Chunk episodes into groups of 100
  const chunkEpisodes = [];
  for (let i = 0; i < episodes?.length; i += 100) {
    const chunk = episodes?.slice(i, i + 100);
    chunkEpisodes?.push(chunk);
  }

  // Dropdown options for episode chunks
  const dropDownEp = [];
  for (let i = 0; i < chunkEpisodes.length; i++) {
    dropDownEp.push({
      value: i,
      first: chunkEpisodes[i][0].number,
      last: chunkEpisodes[i][chunkEpisodes[i].length - 1].number,
      episodesId: chunkEpisodes[i],
    });
  }

  // Default value for dropdown based on current episode
  const defaultValue = dropDownEp.findIndex((item) =>
    item.episodesId.some((item) => item.episodeId.split("=")[1] === ep)
  );

  return (
    <>
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search episode number..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-md"
        />
      </div>

      {/* Episodes dropdown */}
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

      {/* Episode cards */}
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
          "bg-zinc-900 p-[.4rem] text-[13.5px] hover:bg-zinc-800 hover:text-zinc-300 md:text-sm text-center text-zinc-500",
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
