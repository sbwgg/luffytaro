"use client";

import { cn } from "@/lib/utils";
import React, { useState, useTransition } from "react";
import { FaPlus, FaCheck } from "react-icons/fa";
import { AnimeInfoType } from "../page";
import { BiSolidEdit } from "react-icons/bi";
import actionAddAnime from "@/action/watch-list/actionAddAnime";
import { toast } from "sonner";
import actionRemoveAnime from "@/action/watch-list/actionRemoveAnime";
import actionEditWatchlist from "@/action/watch-list/actionEditWatchlist";
import { FiLoader } from "react-icons/fi";

interface AddToListButtonProp {
  animeInfo: AnimeInfoType;
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

const AddToListButton = ({ animeInfo, watchList }: AddToListButtonProp) => {
  const [showStatus, setShowStatus] = useState(false);
  const [isPending, setTransition] = useTransition();

  const isAdded = watchList?.find(
    (item) => item.infoId === animeInfo.anime.info.id
  );

  const addToListStatus = isAdded
    ? ["Watching", "On-Hold", "Plan to watch", "Dropped", "Completed", "Remove"]
    : ["Watching", "On-Hold", "Plan to watch", "Dropped", "Completed"];

  async function onAddToList(item: string) {
    if (!isAdded) {
      setShowStatus(false);
      setTransition(() => {
        actionAddAnime(item, animeInfo.anime.info).then((data) => {
          if (data?.error) {
            return toast.error("Error", {
              description: data.error,
            });
          }

          toast.success("Success", {
            description: `Added ${animeInfo.anime.info.name} to your watch list`,
          });
        });
      });
    }

    if (item === "Remove") {
      setShowStatus(false);
      setTransition(() => {
        actionRemoveAnime(animeInfo.anime.info.id).then(() => {
          toast.success("Success", {
            description: `Remove ${animeInfo.anime.info.name} to your watch list`,
          });
        });
      });
    }

    if (isAdded && item !== "Remove") {
      setShowStatus(false);
      setTransition(() => {
        actionEditWatchlist(animeInfo.anime.info.id, item).then(() => {
          toast.success("Success", {
            description: `Change ${animeInfo.anime.info.name} status to ${item}`,
          });
        });
      });
    }
  }

  return (
    <div className="relative">
      <button
        disabled={isPending}
        onClick={() => setShowStatus(!showStatus)}
        className={cn(
          "bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full md:rounded disabled:text-white/30"
        )}
      >
        {isPending ? (
          <span className="flex items-center py-[.2rem] px-9 text-zinc-400">
            <FiLoader className="animate-spin text-xl" />
          </span>
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
            <button
              onClick={() => onAddToList(item)}
              key={item}
              className={cn(
                "p-3 rounded-none lg:hover:bg-zinc-300 w-full",
                item === "Remove" && "text-red-500",
                isAdded?.status === item
                  ? "font-bold flex items-center justify-center gap-x-2"
                  : ""
              )}
            >
              {isAdded?.status === item && <FaCheck />}
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToListButton;
