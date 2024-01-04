import React from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
const ContinueWatching = dynamic(
  () => import("./_components/continueWatching"),
  { ssr: false }
);
import "./_components/cWatching.css";
import dynamic from "next/dynamic";

const ContinueWatchingPage = async () => {
  return (
    <div className="pt-28">
      <div className="flex items-center justify-center">
        <div className="flex-1 max-w-[60rem] mx-3">
          <h1 className="flex items-center gap-2 text-xl">
            <FaClockRotateLeft className="text-yellow-600" />
            Continue watching
          </h1>

          <ContinueWatching />
        </div>
      </div>
    </div>
  );
};

export default ContinueWatchingPage;
