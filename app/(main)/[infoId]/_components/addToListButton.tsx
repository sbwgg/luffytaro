"use client";

import actionAddAnime from "@/action/watch-list/actionAddAnime";
import { cn } from "@/lib/utils";
import React, { useState, useTransition } from "react";
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

export const dynamic = "force-dynamic";

const AddToListButton = ({
  animeInfo,
  watchList,
  user,
}: AddToListButtonProp) => {
  const [showStatus, setShowStatus] = useState(false);
  const [isPending, setTransition] = useTransition();

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

  const isAdded = watchList?.find(
    (item) => item.infoId === animeInfo.anime.info.id
  );

  const addToListStatus = isAdded
    ? ["Watching", "On-Hold", "Plan to watch", "Dropped", "Completed", "Remove"]
    : ["Watching", "On-Hold", "Plan to watch", "Dropped", "Completed"];

  function handleAddToList(item: string) {
    if (!user?.id)
      return alert(
        `Login to add ${animeInfo.anime.info.name} to your Watch List!`
      );

    setShowStatus(false);

    if (!isAdded) {
      setTransition(async () => {
        addAnimeToWatchLisst(item);
      });
    }

    if (isAdded && item !== "Remove") {
      setTransition(async () => {
        editAnimeStatus(item);
      });
    }

    if (item === "Remove") {
      setTransition(async () => {
        removeAnimeFromWatchList();
      });
    }
  }

  async function addAnimeToWatchLisst(status: string) {
    await actionAddAnime(addAnime, status);
    toast("Success", {
      description: `Added ${addAnime.name} to your Watch List`,
    });
  }

  async function editAnimeStatus(status: string) {
    await actionEditWatchlist(isAdded?.id, status, animeInfo.anime.info.id);
    toast("Success", {
      description: `Added ${addAnime.name} to your Watch List`,
    });
  }

  async function removeAnimeFromWatchList() {
    await actionRemoveAnime(isAdded?.id, animeInfo.anime.info.id);
    toast("Success", {
      description: `Added ${addAnime.name} to your Watch List`,
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowStatus(!showStatus)}
        className={cn(
          "bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full md:rounded"
        )}
      >
        {isPending ? (
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
            <button
              key={item}
              onClick={() => handleAddToList(item)}
              disabled={isPending || item === isAdded?.status}
              className={cn(
                "p-3 rounded-none lg:hover:bg-zinc-300 w-full",
                item === "Remove" && "text-red-500",
                isAdded?.status === item
                  ? "font-bold flex items-center justify-center gap-x-2"
                  : "",
                isAdded?.status === item || isPending
                  ? "cursor-not-allowed"
                  : ""
              )}
            >
              {item} {isAdded?.status === item && <FaCheck />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToListButton;
