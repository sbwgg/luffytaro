"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import ContinueWatchingCard from "../../(route)/_components/continueWatchingCard";
import { localStorageWatchedTime } from "../../(route)/_components/continueWatching";

const ContinueWatching = () => {
  const [watchedTime, setWatchedTime] =
    useLocalStorage<localStorageWatchedTime>("artplayer_settings", {
      watchedTime: [],
    });

  const allLastViewed = watchedTime.watchedTime.filter((w) => w.lastViewed);

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
