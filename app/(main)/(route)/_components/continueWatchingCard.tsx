import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WatchedTimeType } from "../../watch/[infoId]/_components/videoPlayerRow";
import Image from "next/image";
import { AnimeInfoType } from "../../[infoId]/page";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import { localStorageWatchedTime } from "./continueWatching";

interface ContinueWatchingCardProp {
  anime: WatchedTimeType;
  setWatchedTime: React.Dispatch<React.SetStateAction<localStorageWatchedTime>>;
}

const ContinueWatchingCard = ({
  anime,
  setWatchedTime,
}: ContinueWatchingCardProp) => {
  const { data: animeInfo } = useQuery({
    queryKey: ["anime-info", anime.infoId],
    queryFn: async () => {
      try {
        const res = await axios.get<AnimeInfoType>(
          `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/anime/info/?id=${anime.infoId}`
        );
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
  });

  const formatSeconds = () => {
    const seconds = anime.currentTime;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(remainingSeconds).padStart(2, "0")}`;
    } else if (minutes > 0) {
      return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
    } else {
      return `00:${String(remainingSeconds).padStart(2, "0")}`;
    }
  };

  const formatDuration = () => {
    const seconds = anime.endTime;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(remainingSeconds).padStart(2, "0")}`;
    } else if (minutes > 0) {
      return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
    } else {
      return `00:${String(remainingSeconds).padStart(2, "0")}`;
    }
  };

  const calculateProgress = () => {
    const duration = anime.endTime;
    const currentTime = anime.currentTime;
    const progress = (currentTime / duration) * 100;
    return progress;
  };

  function onRemoveWatchedTime() {
    setWatchedTime((prev) => ({
      ...prev,
      watchedTime: prev.watchedTime.filter((item) => item.ep !== anime.ep),
    }));
  }

  return (
    <div>
      <div className="relative shrink-0">
        <button
          onClick={onRemoveWatchedTime}
          className="absolute top-2 right-2 scale-[1.1] rounded-full p-1 bg-black/60 backdrop-blur-sm z-[10]"
        >
          <IoClose />
        </button>
        <Link href={`/watch/${anime.infoId}?ep=${anime.ep}`}>
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent via-transparent" />
          <div className="absolute bottom-2 inset-x-2">
            <div className="flex justify-between sm:text-sm text-xs mb-1">
              <p>{formatSeconds()}</p>
              <p>{formatDuration()}</p>
            </div>
            <Progress value={calculateProgress()} />
          </div>
          {animeInfo?.anime.info.poster ? (
            <Image
              src={animeInfo?.anime.info.poster}
              alt="poster"
              width={500}
              height={400}
              priority
              className="h-[14rem] w-full object-cover"
            />
          ) : (
            <Skeleton className="bg-zinc-800 h-[14rem] w-full object-cover rounded" />
          )}
        </Link>
      </div>
      <div>
        <p className="text-sm mt-2 truncate hover:text-red-500">
          <Link href={`/watch/${anime.infoId}?ep=${anime.ep}`}>
            {animeInfo?.anime?.info?.name}
          </Link>
        </p>
        <div className="flex gap-x-2 text-zinc-400 items-center mt-1 text-xs">
          <p>{animeInfo?.anime.info.stats.type}</p>
          &#x2022;
          <p>{animeInfo?.anime.info.stats.duration}</p>
        </div>
      </div>
    </div>
  );
};

export default ContinueWatchingCard;
