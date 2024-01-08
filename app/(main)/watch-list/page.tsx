import React from "react";
import { FaHeart } from "react-icons/fa";
const WatchListRow = dynamic(() => import("./_components/watchListRow"), {
  ssr: false,
});
import "./_components/watchList.css";
import dynamic from "next/dynamic";
import getWatchList from "@/get-data/watch-list/getWatchList";

const WatchListPage = async () => {
  const watchList = await getWatchList();

  return (
    <div className="pt-28">
      <div className="flex items-center justify-center flex-1">
        <div className="flex-1 max-w-[60rem] mx-3">
          <h1 className="flex gap-x-4 items-center text-xl">
            <FaHeart className="text-red-500 scale-[1.4]" />
            Watch list
          </h1>

          <WatchListRow watchList={watchList} />
        </div>
      </div>
    </div>
  );
};

export default WatchListPage;
