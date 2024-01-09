"use client";

import actionAddAnime from "@/action/watch-list/actionAddAnime";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { FaPlus, FaCheck } from "react-icons/fa";
import { AnimeInfoType } from "../page";
import { BiSolidEdit } from "react-icons/bi";
import actionRemoveAnime from "@/action/watch-list/actionRemoveAnime";
import actionEditWatchlist from "@/action/watch-list/actionEditWatchlist";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
}

type WatchListType = {
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

const AddToListButton = ({ animeInfo, user }: AddToListButtonProp) => {
  const queryClient = useQueryClient();
  const [showStatus, setShowStatus] = useState(false);

  const { data: watchList, isLoading } = useQuery({
    queryKey: ["watch-list", user?.id],
    queryFn: async () => {
      try {
        const res = await axios.get<WatchListType[]>(
          `${process.env.NEXT_PUBLIC_MAIN_URL}/api/watch-list?User=${user?.id}`
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

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

  const mutateAddAnimeToWatchList = useMutation({
    mutationFn: async (status: string) => {
      try {
        const data = await actionAddAnime(addAnime, status);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (newData) => {
      if (newData) {
        queryClient.setQueryData(["watch-list", user?.id], (old) => [
          ...(old as WatchListType[]),
          newData,
        ]);
        toast("Success", {
          description: `Added ${newData.name} to your Watch List`,
        });
      }
    },
  });

  const mutateEditAnimeStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      try {
        const data = await actionEditWatchlist(
          id,
          status,
          animeInfo.anime.info.id
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (newData) => {
      if (newData) {
        toast("Success", {
          description: `You change status to ${newData?.status}`,
        });
      }
    },
    onMutate: (variable) => {
      queryClient.setQueryData(["watch-list", user?.id], (old) =>
        old?.map((o) =>
          o.id === variable.id ? { ...o, status: variable.status } : o
        )
      ) as WatchListType[];
    },
  });

  const mutateRemoveAnimeFromWatchList = useMutation({
    mutationFn: async (id: string | undefined) => {
      try {
        const data = await actionRemoveAnime(id, animeInfo.anime.info.id);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (newData) => {
      toast("Success", {
        description: `You remove ${newData?.name} to your watch list`,
      });
    },
    onMutate: (variable) => {
      queryClient.setQueryData(["watch-list", user?.id], (old) =>
        old?.filter((item) => item.id !== variable)
      ) as WatchListType[];
    },
  });

  function handleAddToList(item: string) {
    if (!user?.id)
      return alert(
        `Login to add ${animeInfo.anime.info.name} to your Watch List!`
      );

    setShowStatus(false);

    if (!isAdded) {
      mutateAddAnimeToWatchList.mutate(item);
    }

    if (isAdded && item !== "Remove") {
      mutateEditAnimeStatus.mutateAsync({ id: isAdded.id, status: item });
    }

    if (item === "Remove") {
      mutateRemoveAnimeFromWatchList.mutate(isAdded?.id);
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
            <button
              key={item}
              onClick={() => handleAddToList(item)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToListButton;
