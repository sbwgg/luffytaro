"use client";

import React, { useCallback, useEffect, useState } from "react";
import { EpisodeServerType } from "../page";
import axios from "axios";
import PlayerSettings from "./playerSettings";
import { useLocalStorage } from "@uidotdev/usehooks";
import { EpisodeType } from "@/app/(main)/[infoId]/_components/animeInfo";
import { useRouter } from "next/navigation";
import { TbFaceIdError } from "react-icons/tb";
import { AnimeInfoType, MetaAnilistInfoType } from "@/app/(main)/[infoId]/page";
import NextEpisodeTime from "@/components/nextEpisodeTime";
import Artplayer from "./artPlayer";

interface VideoPlayerRowProp {
  episodeServer: EpisodeServerType;
  animeEpisodes: EpisodeType;
  infoId: string;
  ep: string;
  metaAnilistInfo: MetaAnilistInfoType;
  bannerImage: string | undefined;
  animeInfo: AnimeInfoType;
}

export interface StreamingLinkType {
  tracks: {
    file: string;
    label?: string;
    kind: string;
    default: boolean;
  }[];
  intro: {
    start: number;
    end: number;
  };
  outro: {
    start: number;
    end: number;
  };
  sources: {
    url: string;
    type: string;
  }[];
  anilistID: number;
  malID: number;
}

export interface WatchedTimeType {
  currentTime: number;
  endTime: number;
  infoId: string;
  ep: string;
  episodeNo: number;
  lastViewed: boolean;
}

const VideoPlayerRow = ({
  episodeServer,
  animeEpisodes,
  infoId,
  ep,
  metaAnilistInfo,
  bannerImage,
  animeInfo,
}: VideoPlayerRowProp) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [streamingLink, setStreamingLink] = useState<StreamingLinkType | null>(
    null
  );
  const [server, setServer] = useLocalStorage("server", "vidstreaming");
  const [category, setCategory] = useLocalStorage("category", "sub");

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const res = await axios.get<StreamingLinkType>(
          `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/anime/episode-srcs?id=${episodeServer.episodeId}&server=${server}&category=${category}`
        );
        setStreamingLink(res.data);
      } catch {
        setStreamingLink(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [episodeServer.episodeId, server, category]);

  const defaultUrl = streamingLink?.sources?.find((url) => url?.type === "hls");

  const currentEpWatching = animeEpisodes?.episodes?.findIndex(
    (item) => item?.episodeId === episodeServer?.episodeId
  );
  const nextEp = animeEpisodes?.episodes[currentEpWatching + 1];
  const prevEp = animeEpisodes?.episodes[currentEpWatching - 1];

  const getInstance = useCallback(
    (art: Artplayer) => {
      art.on("ready", () => {
        const autoplay = JSON.parse(localStorage.getItem("autoplay") as string);

        if (autoplay) {
          art.play();
          art.poster = "";
        }
      });

      art.on("video:ended", () => {
        const autonext = JSON.parse(localStorage.getItem("autonext") as string);
        const storedWatchedTime = art.storage.get(
          "watchedTime"
        ) as WatchedTimeType[];
        const removeWatchedTime = storedWatchedTime.filter(
          (item) => item.ep !== ep
        );
        art.storage.set("watchedTime", removeWatchedTime);

        if (autonext) {
          router.push(`/watch/${nextEp.episodeId}`);
        }
      });

      art.on("video:timeupdate", () => {
        const currentTime = art.currentTime;
        const duration = art.duration;
        const autoskipIntro = JSON.parse(
          localStorage.getItem("autoskip") as string
        );

        if (streamingLink) {
          if (
            currentTime > streamingLink.intro.start &&
            currentTime < streamingLink.intro.end
          ) {
            if (autoskipIntro) {
              art.currentTime = streamingLink.intro.end;
            }
          }

          if (
            currentTime > streamingLink.outro.start &&
            currentTime < streamingLink.outro.end
          ) {
            if (autoskipIntro) {
              art.currentTime = streamingLink.outro.end;
            }
          }
        }

        const storedWatchedTime = art.storage.get(
          "watchedTime"
        ) as WatchedTimeType[];

        if (
          storedWatchedTime == undefined ||
          !storedWatchedTime.some((item) => item.ep === ep)
        ) {
          storedWatchedTime === undefined
            ? art.storage.set("watchedTime", [
                {
                  currentTime: Math.floor(currentTime),
                  endTime: Math.floor(duration),
                  episodeNo: episodeServer.episodeNo,
                  infoId,
                  ep,
                  lastViewed: true,
                },
              ])
            : art.storage.set("watchedTime", [
                ...storedWatchedTime,
                {
                  currentTime: Math.floor(currentTime),
                  endTime: Math.floor(duration),
                  episodeNo: episodeServer.episodeNo,
                  infoId,
                  ep,
                  lastViewed: true,
                },
              ]);
        } else {
          art.storage.set("watchedTime", [
            ...storedWatchedTime.map((item) =>
              item.ep === ep
                ? {
                    ...item,
                    currentTime: Math.floor(currentTime),
                    lastViewed: true,
                    endTime: Math.floor(duration),
                  }
                : item.ep !== ep && item.infoId === infoId
                ? { ...item, lastViewed: false }
                : item
            ),
          ]);
        }
      });
    },
    [ep, streamingLink, episodeServer, infoId, nextEp, router]
  );

  return (
    <>
      <div className="relative">
        {!isLoading && !streamingLink?.sources.length ? (
          <div className="flex flex-col gap-8 items-center justify-center aspect-video bg-white/5 rounded backdrop-blur-sm mb-2">
            <TbFaceIdError className="text-zinc-700 scale-[5]" />
            <p className="text-zinc-700 text-xl">Something went wrong</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-8 items-center justify-center aspect-video bg-white/5 rounded backdrop-blur-sm mb-2">
            <p className="text-zinc-700 text-xl">Please wait...</p>
          </div>
        ) : (
          <>
            <Artplayer
              key={defaultUrl?.url}
              streamingLink={streamingLink}
              option={{
                poster: bannerImage || "",
                id: episodeServer.episodeId,
                url: defaultUrl?.url || "",
                volume: 0.5,
                isLive: false,
                muted: false,
                autoplay: false,
                pip: true,
                autoSize: false,
                autoMini: false,
                screenshot: true,
                setting: true,
                loop: false,
                flip: true,
                playbackRate: true,
                aspectRatio: true,
                fullscreen: true,
                fullscreenWeb: true,
                subtitleOffset: false,
                miniProgressBar: false,
                mutex: false,
                fastForward: true,
                backdrop: true,
                playsInline: false,
                autoPlayback: true,
                airplay: false,
                lock: true,
              }}
              getInstance={getInstance}
            />
          </>
        )}
      </div>

      <PlayerSettings
        episodeServer={episodeServer}
        setServer={setServer}
        server={server}
        setCategory={setCategory}
        category={category}
        nextEp={nextEp?.episodeId}
        prevEp={prevEp?.episodeId}
        animeInfo={animeInfo}
        animeEpisodes={animeEpisodes}
      />

      {metaAnilistInfo?.nextAiringEpisode ? (
        <div className="text-sm mt-5 text-zinc-400 lg:px-0 px-3">
          <NextEpisodeTime
            nextAiringEpisode={metaAnilistInfo?.nextAiringEpisode}
          />
        </div>
      ) : null}
    </>
  );
};

export default VideoPlayerRow;
