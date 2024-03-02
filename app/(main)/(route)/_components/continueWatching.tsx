"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import { WatchedTimeType } from "../../watch/[infoId]/_components/videoPlayerRow";
import ContinueWatchingCard from "./continueWatchingCard";
import Link from "next/link";

export type localStorageWatchedTime = {
  watchedTime: WatchedTimeType[];
};

const ContinueWatching = () => {
  const [watchedTime, setWatchedTime] =
    useLocalStorage<localStorageWatchedTime>("artplayer_settings", {
      watchedTime: [],
    });

  const allLastViewed = watchedTime?.watchedTime?.filter((w) => w.lastViewed);

  return (
    <>
      {allLastViewed?.length < 1 ? null : (
        <div className="px-3 lg:px-10 mt-5 mb-10">
          <h1 className="sm:text-xl text-md mb-5">
            <Link href="/continue-watching">
              <span className="p-1 mr-3 bg-red-500 rounded-lg" />
              CONTINUE WATCHING &#62;
            </Link>
          </h1>

          <div className="gridCard gap-2 gap-y-8">
            {allLastViewed
              ?.map((item) => (
                <ContinueWatchingCard
                  key={item.ep}
                  anime={item}
                  setWatchedTime={setWatchedTime}
                />
              ))
              .reverse()}
          </div>
        </div>
      )}
    </>
  );
};

export default ContinueWatching;
