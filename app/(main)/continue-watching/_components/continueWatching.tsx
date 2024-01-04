"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import { WatchedTimeType } from "../../watch/[infoId]/_components/videoPlayerRow";
import ContinueWatchingCard from "../../(route)/_components/continueWatchingCard";

const ContinueWatching = () => {
  const [watchedTime, setWatchedTime] = useLocalStorage<WatchedTimeType[]>(
    "watched-time",
    []
  );

  const allLastViewed = watchedTime.filter((w) => w.lastViewed);

  return (
    <>
      {allLastViewed.length < 1 ? (
        <div className="min-h-[50dvh] flex items-center justify-center">
          No history
        </div>
      ) : (
        <>
          <div className="gridCard gap-2 gap-y-8 mt-10">
            {allLastViewed
              .map((item) => (
                <ContinueWatchingCard
                  key={item.ep}
                  anime={item}
                  setWatchedTime={setWatchedTime}
                />
              ))
              .reverse()}
          </div>
        </>
      )}
    </>
  );
};

export default ContinueWatching;
