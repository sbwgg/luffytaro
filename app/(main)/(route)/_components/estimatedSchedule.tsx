import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosPlay } from "react-icons/io";
import { Button } from "../_components/ui/button";
import date from "date-and-time";
import { ScheduleAnimeTypes } from "@/types";

const primaryUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:4000"
    : process.env.NEXT_PUBLIC_ANIWATCH_URL;
const backupUrl = "https://api-aniwatch.onrender.com";

const ScheduleAnime = () => {
  const now = useMemo(() => new Date(), []);

  let current = date.format(now, "[GMT]ZZ DD/MM/YYYY hh:mm:ss A");
  let today = date.format(now, "YYYY-MM-DD");

  const [currentTime, setCurrentTime] = useState(current);
  const [prevDays, setPrevDays] = useState<Date[]>([]);
  const [upcomingDays, setUpcomingDays] = useState<Date[]>([]);
  const [fetchDate, setFetchDate] = useState<string>(today);
  const [data, setData] = useState<ScheduleAnimeTypes[]>([]);
  const [episodeData, setEpisodeData] = useState<Record<string, number>>({});

  interface EpisodesType {
    totalEpisodes: number;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(date.format(now, "hh:mm:ss"));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const prevDays = Array.from({ length: 15 }).map((_, index) => {
      return date.addDays(now, -(index + 1));
    });

    setPrevDays(prevDays);

    const upcomingDays = Array.from({ length: 15 }).map((_, index) => {
      return date.addDays(now, index);
    });

    setUpcomingDays(upcomingDays);
  }, [now]);

  const fetchAnimeSchedule = async (date: string) => {
    try {
      const data = await fetch(`${primaryUrl}/anime/schedule?date=${date}`);

      if (data.status === 409) {
        const data = await fetch(`${backupUrl}/anime/schedule?date=${date}`);
        const res = await data.json();
        return res.scheduledAnimes as ScheduleAnimeTypes[];
      }

      const res = await data.json();
      return res.scheduledAnimes as ScheduleAnimeTypes[];
    } catch (error) {
      throw error as Error;
    }
  };

  useEffect(() => {
    if (fetchDate) {
      const fetchData = async () => {
        const schedule = await fetchAnimeSchedule(fetchDate);
        setData(schedule);
      };

      fetchData();
    }
  }, [fetchDate]);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      const episodeData: Record<string, number> = {};
      for (const anime of data) {
        try {
          const res = await axios.get<EpisodesType>(
            `${primaryUrl}/anime/episodes/${anime.id}`
          );
          episodeData[anime.id] = res.data.totalEpisodes;
        } catch (error) {
          console.error(`Failed to fetch episodes for anime ${anime.id}`, error);
          // Optionally, handle the error (e.g., set total episodes to 0)
          episodeData[anime.id] = 0;
        }
      }
      setEpisodeData(episodeData);
    };

    fetchEpisodeData();
  }, [data]);

  const handleShow = (date: number, month: number, year: number) => {
    const data =
      year +
      "-" +
      (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
      "-" +
      (date < 10 ? "0" + date : date);
    return setFetchDate(data);
  };

  const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <div className="flex sm:flex-row flex-col gap-y-2 justify-between w-full">
        <h6 className="text-2xl font-semibold text-primary">
          Estimated Schedule
        </h6>
        <p className="font-semibold sm:py-0 py-2 text-sm bg-red-500 flex gap-1 items-center px-3 rounded-full"> 
          {current}
        </p>
      </div>

      <div className="relative my-4 w-full">
        {/* Your carousel code here... */}
      </div>

      <div className="w-full h-auto">
        {!data
          ? "loading"
          : data.map((anime, index) => (
              <div
                className="w-full py-3 flex gap-x-2 justify-between px-2 bg-zinc-900/60 hover:bg-zinc-900/50"
                key={index}
              >
                <div>
                  <div className="flex items-center">
                    <IoIosPlay className="text-zinc-500 scale-[1.1] group-hover/play:text-white" />
                    <span>Episodes: {episodeData[anime.id] || "Loading..."}</span>
                  </div>
                </div>
                <div className="flex-grow ml-4">
                  <Link href={`/${anime.id}`} className="text-md font-medium text-base hover:text-white duration-200">
                    {anime.name}
                  </Link>
                  <span className="text-sm text-gray-400 ml-2">{anime.time}</span>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default ScheduleAnime;