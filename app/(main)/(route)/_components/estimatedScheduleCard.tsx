import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { IoIosPlay } from "react-icons/io";

interface ScheduleAnimeCardProp {
  sched: { id: string; jname: string; name: string; time: string };
}

interface EpisodesType {
  totalEpisodes: number;
}

export default function EstimatedScheduleCard({ sched }: ScheduleAnimeCardProp) {
  const { data: episodes } = useQuery({
    queryKey: ["anime-episodes", sched.id],
    queryFn: async () => {
      try {
        const res = await axios.get<EpisodesType>(
          `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/anime/episodes/${sched.id}`
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Link
      href={`/${sched.id}`}
      className="flex sm:gap-x-8 gap-x-5  py-4 border-b border-dashed border-zinc-700 group/items hover:text-red-500 group/yellowBg group/textColor group/play duration-200 transition-all"
    >
      <p className="text-zinc-400 group-hover/items:text-red-500">
        {sched.time}
      </p>
      <p className="flex-1 italic tracking-wider">{sched.name}</p>
      <p className="text-[13px] flex items-center gap-x-1 group-hover/yellowBg:bg-red-500 group-hover/textColor:text-black py-1 px-3 rounded">
        <IoIosPlay className="text-zinc-500 scale-[1.1] group-hover/play:text-black" />
        <span>Episodes</span>
        <span>{episodes?.totalEpisodes}</span>
      </p>
    </Link>
  );
}
