import React from "react";
import { AiFillClockCircle, AiFillCalendar } from "react-icons/ai";
import { FaClosedCaptioning } from "react-icons/fa6";
import { FaMicrophone, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { IoMdPlay } from "react-icons/io";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EpisodeType } from "../../[infoId]/_components/animeInfo";

interface SpotlightAnimeCardProp {
  s: {
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
  };
}

const SpotlightAnimeCard = ({ s }: SpotlightAnimeCardProp) => {
  const { data: episodes } = useQuery({
    queryKey: ["episodes", s.id],
    queryFn: async () => {
      try {
        const res = await axios.get<EpisodeType>(
          `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/anime/episodes/${s.id}`
        );
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <>
      <div
        style={{
          background: `url(${s.poster})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
        className="relative flex items-end shadow h-[23rem] sm:h-[30rem] lg:h-[35rem] z-[1]"
      >
        <div className="max-w-[35rem] flex-1 ml-5 lg:ml-20 mb-10">
          <p className="sm:text-lg text-red-500 mb-3">#{s.rank} Spotlight</p>
          <h1
            className={`max-w-[14rem] sm:max-w-full titleEllipsis text-xl lg:text-4xl font-bold md:font-extrabold`}
          >
            {s.name}
          </h1>

          <div className="hidden sm:flex items-center gap-x-3 my-2 text-sm">
            <p>{s.otherInfo[0]}</p>
            {s.otherInfo[1] && (
              <p className="flex items-center gap-x-1">
                <AiFillClockCircle />
                {s.otherInfo[1]}
              </p>
            )}
            {s.otherInfo[2] && (
              <p className="flex items-center gap-x-1">
                <AiFillCalendar />
                {s.otherInfo[2]}
              </p>
            )}
            {s.otherInfo[3] && (
              <p className="flex items-center gap-x-1 bg-red-500 italic p-1 px-2 rounded text-xs">
                {s.otherInfo[3]}
              </p>
            )}
            {s.episodes.sub && (
              <p className="flex items-center gap-x-2">
                <FaClosedCaptioning />
                {s.episodes.sub}
              </p>
            )}
            {s.episodes.dub && (
              <p className="flex items-center gap-x-2">
                <FaMicrophone />
                {s.episodes.dub}
              </p>
            )}
          </div>

          <div className="italic hidden md:block">
            <p className="ellipsis">{s.description}</p>
          </div>

          <div className="flex items-center gap-x-2 mt-3 md:mt-8">
            <Link
              className="flex items-center gap-x-2 bg-red-500 sm:p-2 sm:px-4 sm:text-base text-sm p-2 px-3 md:rounded rounded-full"
              href={`/watch/${episodes?.episodes[0]?.episodeId}`}
            >
              <IoMdPlay />
              Watch now
            </Link>
            <Link
              className="flex items-center gap-x-2 bg-white/20 sm:p-2 sm:px-4 sm:text-base text-sm p-2 px-3  md:rounded rounded-full"
              href={`/${s.id}`}
            >
              <FaInfoCircle />
              More details
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpotlightAnimeCard;
