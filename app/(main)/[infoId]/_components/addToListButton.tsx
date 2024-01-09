"use client";

import actionAddAnime from "@/action/watch-list/actionAddAnime";
import { cn } from "@/lib/utils";
import React, { useOptimistic, useState, useTransition } from "react";
import { FaPlus, FaCheck } from "react-icons/fa";
import { AnimeInfoType } from "../page";
import { BiSolidEdit } from "react-icons/bi";
import actionRemoveAnime from "@/action/watch-list/actionRemoveAnime";
import actionEditWatchlist from "@/action/watch-list/actionEditWatchlist";
import { toast } from "sonner";

interface AddToListButtonProp {
  animeInfo: AnimeInfoType;
  user: {
    id: string;
    username: string;
    email: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  watchList:
    | {
        id: string;
        userId: string;
        poster: string;
        name: string;
        rating: string | null;
        quality: string | null;
        sub: number | null;
        dub: number | null;
        type: string | null;
        duration: string | null;
        status: string;
        infoId: string;
        createdAt: Date;
        updatedAt: Date;
      }[]
    | null;
}

type OptimisticType = {
  id: string;
  userId: string;
  poster: string;
  name: string;
  rating: string | null;
  quality: string | null;
  sub: number | null;
  dub: number | null;
  type: string | null;
  duration: string | null;
  status: string;
  infoId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const dynamic = "force-dynamic";

const AddToListButton = ({
  animeInfo,
  watchList,
  user,
}: AddToListButtonProp) => {
  const [showStatus, setShowStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticWatchList, setOptimisticWatchList] = useOptimistic<
    OptimisticType[] | null
  >(watchList);

  const addAnime = {
    poster: animeInfo.anime.info.poster,
    name: animeInfo.anime.info.name,
    rating: animeInfo.anime.info.stats.rating,
    quality: animeInfo.anime.info.stats.quality,
    sub: animeInfo.anime.info.stats.episodes.sub,
    dub: animeInfo.anime.info.stats.episodes.dub,
    type: animeInfo.anime.info.stats.type,
    duration: animeInfo.anime.info.stats.duration,
    infoId: animeInfo.anime.info.id,
  };

  const isAdded = optimisticWatchList?.find(
    (item) => item.infoId === animeInfo.anime.info.id
  );

  const addToListStatus = isAdded
    ? ["Watching", "On-Hold", "Plan to watch", "Dropped", "Completed", "Remove"]
    : ["Watching", "On-Hold", "Plan to watch", "Dropped", "Completed"];

  async function handleAddToList(item: string) {
    setIsLoading(true);

    if (!user?.id)
      return alert(`Login to add ${animeInfo.anime} to your Watch List`);

    try {
      if (!isAdded?.id) {
        const data = await actionAddAnime(addAnime, item);
        setOptimisticWatchList(
          (prev) => [...(prev as OptimisticType[]), data] as OptimisticType[]
        );
        if (data) {
          toast("Success", {
            description: `${data.name} is added to your watch list`,
            action: {
              label: "X",
              onClick: () => {},
            },
          });
        }
      }

      if (isAdded && item !== "Remove") {
        await actionEditWatchlist(isAdded.id, item, isAdded.infoId);
        setOptimisticWatchList(
          (prev) =>
            prev?.map((i) =>
              i.id === isAdded.id ? { ...i, status: item } : i
            ) as OptimisticType[]
        );
        toast("Success", {
          description: `Status change to ${item}`,
          action: {
            label: "X",
            onClick: () => {},
          },
        });
      }

      if (item === "Remove") {
        await actionRemoveAnime(isAdded?.id, isAdded?.infoId);
        setOptimisticWatchList(
          (prev) =>
            prev?.filter((i) => i.id !== isAdded?.id) as OptimisticType[]
        );
        toast("Success", {
          description: `${isAdded?.name} was removed`,
          action: {
            label: "X",
            onClick: () => {},
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowStatus(!showStatus)}
        className={cn(
          "bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full md:rounded"
        )}
      >
        {isLoading ? (
          "Loading..."
        ) : (
          <span className="flex items-center gap-x-2">
            {isAdded ? <BiSolidEdit /> : <FaPlus />}{" "}
            {isAdded?.id ? "Edit Watch list" : "Add to list"}
          </span>
        )}
      </button>

      {showStatus && (
        <div className="absolute top-[3rem] w-[10rem] bg-white rounded-lg text-black text-xs overflow-hidden">
          {addToListStatus.map((item) => (
            <form key={item} action={() => handleAddToList(item)}>
              <button
                disabled={isLoading || item === isAdded?.status}
                className={cn(
                  "p-3 rounded-none lg:hover:bg-zinc-300 w-full",
                  item === "Remove" && "text-red-500",
                  isAdded?.status === item
                    ? "font-bold flex items-center justify-center gap-x-2"
                    : "",
                  isAdded?.status === item || isLoading
                    ? "cursor-not-allowed"
                    : ""
                )}
              >
                {item} {isAdded?.status === item && <FaCheck />}
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToListButton;
