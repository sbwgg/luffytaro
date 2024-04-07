import React from "react";
import { EpisodeServerType } from "../page";
import { cn } from "@/lib/utils";
import { FaForward, FaBackward } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@uidotdev/usehooks";
import { AnimeInfoType } from "@/app/(main)/[infoId]/page";
import { EpisodeType } from "@/app/(main)/[infoId]/_components/animeInfo";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from 'react-icons/tb';
import { FaCheck } from 'react-icons/fa6';
import { RiCheckboxBlankFill } from 'react-icons/ri'



interface PlayerSettingsProp {
  episodeServer: EpisodeServerType;
  setServer: React.Dispatch<React.SetStateAction<string>>;
  server: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  nextEp?: string;
  prevEp?: string;
  animeInfo: AnimeInfoType;
  animeEpisodes: EpisodeType;
}

type ServerRowsProp = {
  episodeServer: EpisodeServerType;
  setServer: React.Dispatch<React.SetStateAction<string>>;
  server: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string;
};

export default function PlayerSettings({
  episodeServer,
  setServer,
  server,
  setCategory,
  category,
  nextEp,
  prevEp,
  animeInfo,
  animeEpisodes,
}: PlayerSettingsProp) {
  const router = useRouter();
  const [autoplay, setAutoplay] = useLocalStorage("autoplay", false);
  const [autonext, setAutonext] = useLocalStorage("autonext", false);
  const [autoskipIntro, setAutoskipIntro] = useLocalStorage("autoskip", false);

  const isFiller = animeEpisodes.episodes.find(
    (item) => item.episodeId == episodeServer.episodeId
  );

  return (
    <div className="px-3 lg:px-0">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-x-3 text-xs sm:text-[12.5px]">
          <button onClick={() => setAutoplay(!autoplay)}>
            {autoplay ? (
              <FaCheck />
            ) : (
              <RiCheckboxBlankFill />
            )} Autoplay
          </button>
          <button onClick={() => setAutonext(!autonext)}>
            {autonext ? (
              <FaCheck />
            ) : (
              <RiCheckboxBlankFill />
            )} Autonext
          </button>
          <button onClick={() => setAutoskipIntro(!autoskipIntro)}>
            {autoskipIntro ? (
              <FaCheck />
            ) : (
              <RiCheckboxBlankFill />
            )} Auto Skip Intro
          </button>
        </div>

        <div className="flex items-center lg:justify-end justify-end flex-1 gap-x-3">
          <Button
            className="p-0 h-0 bg-none"
            disabled={!prevEp}
            onClick={() => router.push(`/watch/${prevEp}`)}
          >
            <FaBackward />
          </Button>
          <Button
            className="p-0 h-0 bg-none"
            disabled={!nextEp}
            onClick={() => router.push(`/watch/${nextEp}`)}
          >
            <FaForward />
          </Button>
        </div>
      </div>

      <div className="flex md:flex-row flex-col  md:gap-4 bg-zinc-950 mt-5">
        <div className="flex items-center justify-center md:max-w-[18rem] text-[13px] text-zinc-500 py-4 px-2 bg-zinc-900">
          <p className="flex flex-col text-center p-2">
            <span>
              You are watching{" "}
              <span className="text-zinc-300">
                {isFiller?.isFiller && "Filler"} Episode{" "}
                {episodeServer.episodeNo}
              </span>
            </span>
            <span>
              (If current server doesn&apos;t work please try other servers
              beside.)
            </span>
          </p>
        </div>

        <ServerRows
          episodeServer={episodeServer}
          setServer={setServer}
          server={server}
          setCategory={setCategory}
          category={category}
        />
      </div>
    </div>
  );
}

function ServerRows({
  episodeServer,
  setServer,
  server,
  setCategory,
  category,
}: ServerRowsProp) {
  return (
    <>
      <div className="flex flex-col justify-center gap-y-1 py-4 px-3">
        {episodeServer.sub.length ? (
          <div className="flex gap-x-1 gap-y-1">
            <div className="flex">
              <p className="text-xs text-zinc-400 w-[2.5rem] py-2">SUB:</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {episodeServer.sub.map((sub) => (
                <button
                  onClick={() => {
                    setServer(
                      sub.serverName === "hd-1"
                        ? "vidstreaming"
                        : sub.serverName
                    );
                    setCategory("sub");
                  }}
                  className={cn(
                    "bg-zinc-900 sm:hover:bg-zinc-800 py-2 px-4 text-xs md:text-sm text-zinc-400",
                    server === sub.serverName &&
                      category === "sub" &&
                      "bg-red-500 text-white sm:hover:bg-red-500",
                    server === "vidstreaming" &&
                      sub.serverName === "hd-1" &&
                      category === "sub" &&
                      "bg-red-500 text-white sm:hover:bg-red-500"
                  )}
                  key={sub.serverId}
                >
                  {sub.serverName}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {episodeServer.dub.length ? (
          <div className="flex gap-x-1 gap-y-1">
            <div className="flex">
              <p className="text-xs text-zinc-400 w-[2.5rem] py-2">DUB:</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {episodeServer.dub.map((dub) => (
                <button
                  onClick={() => {
                    setServer(
                      dub.serverName === "hd-1"
                        ? "vidstreaming"
                        : dub.serverName
                    );
                    setCategory("dub");
                  }}
                  className={cn(
                    "bg-zinc-900 sm:hover:bg-zinc-800 p-2 px-4 text-xs md:text-sm text-zinc-400",
                    server === dub.serverName &&
                      category === "dub" &&
                      "bg-red-500 text-white sm:hover:bg-red-500",
                    server === "vidstreaming" &&
                      dub.serverName === "hd-1" &&
                      category === "dub" &&
                      "bg-red-500 text-white sm:hover:bg-red-500"
                  )}
                  key={dub.serverId}
                >
                  {dub.serverName}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
