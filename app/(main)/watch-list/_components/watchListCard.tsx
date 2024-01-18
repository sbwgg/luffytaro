import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { FaClosedCaptioning, FaMicrophone } from "react-icons/fa";
import { EpisodeType } from "../../[infoId]/_components/animeInfo";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WatchedTimeType } from "../../watch/[infoId]/_components/videoPlayerRow";
import { HiDotsVertical } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { FaCheck } from "react-icons/fa";
import actionEditWatchlist from "@/action/watch-list/actionEditWatchlist";
import actionRemoveAnime from "@/action/watch-list/actionRemoveAnime";

interface WatchListCardProp {
  item: {
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
  setShowStatus: React.Dispatch<React.SetStateAction<string>>;
  showStatus: string;
}

const WatchListCard = ({
  item,
  setShowStatus,
  showStatus,
}: WatchListCardProp) => {
  const watchedTime: WatchedTimeType[] = JSON.parse(
    localStorage.getItem("watched-time") as string
  );

  const filteredWatchedTime = watchedTime.find(
    (w) => w.lastViewed && w.infoId === item.infoId
  );

  const { data: episodes } = useQuery({
    queryKey: ["episodes", item.infoId],
    queryFn: async () => {
      try {
        const res = await axios.get<EpisodeType>(
          `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/anime/episodes/${item.infoId}`
        );
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
  });

  const status = [
    "Watching",
    "On-Hold",
    "Plan to watch",
    "Dropped",
    "Completed",
    "Remove",
  ];

  return (
    <>
      <div>
        <div className="relative w-full h-[14rem] md:h-[16rem]">
          <button
            onClick={() =>
              setShowStatus((prev) => (prev === item.id ? "" : item.id))
            }
            className="bg-white text-black p-1 rounded absolute right-2 top-2 z-[10]"
          >
            <HiDotsVertical />
          </button>
          {item.id === showStatus && (
            <div className="absolute right-2 top-10 overflow-hidden text-xs w-[9rem] bg-white rounded text-black flex flex-col z-[10]">
              {status.map((s) => (
                <button
                  onClick={async () => {
                    if (s !== "Remove") {
                      setShowStatus("");
                      await actionEditWatchlist(item.id, s, "profile");
                      toast("Success", {
                        description: `Change to ${s}`,
                        action: {
                          label: "X",
                          onClick: () => {},
                        },
                      });
                    } else {
                      setShowStatus("");
                      await actionRemoveAnime(item.id, "profile");
                      toast("success", {
                        description: `Remove ${item?.name} to your Watch List`,
                        action: {
                          label: "X",
                          onClick: () => {},
                        },
                      });
                    }
                  }}
                  className={cn(
                    "p-3 hover:bg-zinc-300",
                    s === "Remove" && "text-red-500",
                    s === item.status &&
                      "font-bold flex items-center gap-2 justify-center"
                  )}
                  key={s}
                >
                  {s} {s === item.status && <FaCheck />}
                </button>
              ))}
            </div>
          )}

          <Link
            href={
              episodes?.episodes[0]?.episodeId
                ? `/watch/${episodes.episodes[0].episodeId}`
                : ""
            }
          >
            <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

            {item.rating === "R" || item.rating === "R+" ? (
              <p className="absolute right-1 top-1 text-xs p-1 px-2 bg-red-500 rounded">
                18+
              </p>
            ) : null}
            <div className="flex items-center gap-x-2 absolute bottom-2 left-2">
              {item.sub && (
                <p className="flex items-center gap-x-1 text-xs">
                  <FaClosedCaptioning /> {item.sub}
                </p>
              )}
              {item.dub && (
                <p className="flex items-center gap-x-1 text-xs">
                  <FaMicrophone /> {item.dub}
                </p>
              )}
            </div>
            <Image
              src={item.poster}
              alt="poster"
              width={400}
              height={300}
              priority
              className="w-full h-full object-cover shrink-0"
            />
          </Link>
        </div>
        <div className="mt-2">
          <p className="truncate hover:text-red-500">
            <Link
              className="text-sm"
              href={
                episodes?.episodes[0]?.episodeId && !filteredWatchedTime?.ep
                  ? `/watch/${episodes.episodes[0].episodeId}`
                  : `/watch/${filteredWatchedTime?.infoId}?ep=${filteredWatchedTime?.ep}`
              }
            >
              {item.name}
            </Link>
          </p>
          <p className=" flex items-center gap-x-2 text-gray-300 mt-2 text-sm">
            <span className="truncate">{item.duration}</span> &#x2022;{" "}
            <span className="truncate">{item.type}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default WatchListCard;
