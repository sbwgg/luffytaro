"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import WatchListCard from "./watchListCard";

interface WatchListRowProp {
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

const WatchListRow = ({ watchList }: WatchListRowProp) => {
  const [filterStatus, setFilterStatus] = useState("");
  const [showStatus, setShowStatus] = useState("");

  const status = [
    "All",
    "Watching",
    "On-Hold",
    "Plan to watch",
    "Dropped",
    "Completed",
  ];

  return (
    <div className="mt-10">
      <div className="space-y-1 md:space-y-2 text-xs sm:text-sm mb-5">
        {status.map((s) => (
          <button
            onClick={() => setFilterStatus(s === "All" ? "" : s)}
            className={cn(
              "p-2 rounded bg-zinc-700 min-w-[5rem] md:mr-2 mr-1",
              filterStatus === s && "bg-red-600",
              !filterStatus && s === "All" && "bg-red-600"
            )}
            key={s}
          >
            {s}
          </button>
        ))}
      </div>

      {!!watchList?.length &&
      watchList?.filter((i) => i.status.includes(filterStatus)).length < 1 ? (
        <div className="min-h-[50dvh] flex justify-center items-center">
          No {filterStatus || "anime watch list"}
        </div>
      ) : (
        <div className="gridCard gap-2 gap-y-7 w-full">
          {!!watchList?.length &&
            watchList
              ?.filter((i) => i.status.includes(filterStatus))
              .map((item) => (
                <WatchListCard
                  setShowStatus={setShowStatus}
                  showStatus={showStatus}
                  item={item}
                  key={item.id}
                />
              ))}
        </div>
      )}
    </div>
  );
};

export default WatchListRow;
