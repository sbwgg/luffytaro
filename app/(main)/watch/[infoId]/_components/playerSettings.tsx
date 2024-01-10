import React from "react";
import { EpisodeServerType } from "../page";
import { cn } from "@/lib/utils";
import { FaForward, FaBackward } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PlayerSettingsProp {
  episodeServer: EpisodeServerType;
  setAutoplay: React.Dispatch<React.SetStateAction<boolean>>;
  autoplay: boolean;
  setAutonext: React.Dispatch<React.SetStateAction<boolean>>;
  autonext: boolean;
  setAutoskipIntro: React.Dispatch<React.SetStateAction<boolean>>;
  autoskipIntro: boolean;
  setServer: React.Dispatch<React.SetStateAction<string>>;
  server: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  nextEp?: string;
  prevEp?: string;
}

const PlayerSettings = ({
  episodeServer,
  setAutoplay,
  autoplay,
  setAutonext,
  autonext,
  setAutoskipIntro,
  autoskipIntro,
  setServer,
  server,
  setCategory,
  category,
  nextEp,
  prevEp,
}: PlayerSettingsProp) => {
  const router = useRouter();

  return (
    <div className="px-3 lg:px-0">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-x-3 text-xs sm:text-[12.5px]">
          <button onClick={() => setAutoplay(!autoplay)}>
            Auto play{" "}
            {autoplay ? (
              <span className="text-green-500">ON</span>
            ) : (
              <span className="text-red-500">OFF</span>
            )}
          </button>
          <button onClick={() => setAutonext(!autonext)}>
            Auto next{" "}
            {autonext ? (
              <span className="text-green-500">ON</span>
            ) : (
              <span className="text-red-500">OFF</span>
            )}
          </button>
          <button onClick={() => setAutoskipIntro(!autoskipIntro)}>
            Auto skip intro{" "}
            {autoskipIntro ? (
              <span className="text-green-500">ON</span>
            ) : (
              <span className="text-red-500">OFF</span>
            )}
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

      <div className="flex items-center gap-x-4 gap-y-1 flex-wrap mt-5 bg-zinc-900/70 p-2 px-4">
        {episodeServer.sub.length ? (
          <div className="flex items-center flex-wrap gap-x-1 gap-y-1">
            <p className="text-xs text-zinc-400 mr-3">SUB:</p>
            {episodeServer.sub.map((sub) => (
              <button
                onClick={() => {
                  setServer(sub.serverName);
                  setCategory("sub");
                }}
                className={cn(
                  "bg-black sm:hover:bg-zinc-800 p-2 px-4 text-xs sm:text-sm",
                  server === sub.serverName &&
                    category === "sub" &&
                    "bg-red-500"
                )}
                key={sub.serverId}
              >
                {sub.serverName}
              </button>
            ))}
          </div>
        ) : null}

        {episodeServer.dub.length ? (
          <div className="flex items-center flex-wrap gap-x-1 gap-y-1">
            <p className="text-xs text-zinc-400 mr-3">DUB:</p>
            {episodeServer.dub.map((dub) => (
              <button
                onClick={() => {
                  setServer(dub.serverName);
                  setCategory("dub");
                }}
                className={cn(
                  "bg-black sm:hover:bg-zinc-800 p-2 px-4 text-xs sm:text-sm",
                  server === dub.serverName &&
                    category === "dub" &&
                    "bg-red-500"
                )}
                key={dub.serverId}
              >
                {dub.serverName}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PlayerSettings;
