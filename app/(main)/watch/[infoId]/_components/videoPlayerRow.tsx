"use client";

import React, { useCallback, useEffect, useState } from "react";
import { EpisodeServerType, SkiptimeType } from "../page";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/base.css";
import axios from "axios";
import PlayerSettings from "./playerSettings";
import { useLocalStorage } from "@uidotdev/usehooks";
import { EpisodeType } from "@/app/(main)/[infoId]/_components/animeInfo";
import { useRouter } from "next/navigation";
import { TbFaceIdError } from "react-icons/tb";
import { AnimeInfoType, MetaAnilistInfoType } from "@/app/(main)/[infoId]/page";
import NextEpisodeTime from "@/components/nextEpisodeTime";
import Artplayer from "./artPlayer";
import artplayer from "artplayer";

interface VideoPlayerRowProp {
  episodeServer: EpisodeServerType;
  animeEpisodes: EpisodeType;
  skiptime: SkiptimeType;
  infoId: string;
  ep: string;
  metaAnilistInfo: MetaAnilistInfoType;
  bannerImage: string;
}

export interface StreamingLinkType {
  sources: {
    isM3U8: boolean;
    quality: string;
    url: string;
  }[];
  subtitles: {
    lang: string;
    url: string;
  }[];
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
  skiptime,
  infoId,
  ep,
  metaAnilistInfo,
  bannerImage,
}: VideoPlayerRowProp) => {
  const router = useRouter();
  const [streamingLink, setStreamingLink] = useState<StreamingLinkType | null>(
    null
  );
  const [autoplay, setAutoplay] = useLocalStorage("autoplay", false);
  const [autonext, setAutonext] = useLocalStorage("autonext", false);
  const [autoskipIntro, setAutoskipIntro] = useLocalStorage("autoskip", false);
  const [server, setServer] = useLocalStorage("server", "vidstreaming");
  const [category, setCategory] = useLocalStorage("category", "sub");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      try {
        const res = await axios.get<StreamingLinkType>(
          `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/anime/episode-srcs?id=${episodeServer.episodeId}&server=${server}&category=${category}`
        );
        setStreamingLink(res.data);
        return res.data;
      } catch {
        setStreamingLink(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [episodeServer.episodeId, server, category]);

  const defaultUrl = streamingLink?.sources?.find(
    (url) => url?.quality === "auto"
  );

  const currentSkiptime = skiptime?.episodes?.find(
    (num) => num?.number === episodeServer?.episodeNo
  );

  const currentEpWatching = animeEpisodes?.episodes?.findIndex(
    (item) => item?.episodeId === episodeServer?.episodeId
  );
  const nextEp = animeEpisodes?.episodes[currentEpWatching + 1];
  const prevEp = animeEpisodes?.episodes[currentEpWatching - 1];

  const getInstance = useCallback(
    (art: artplayer) => {
      if (autoplay) {
        art.play();
        art.poster = "";
      }

      if (autonext) {
        art.on("video:ended", () => {
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
      }

      art.on("video:timeupdate", () => {
        const currentTime = art.currentTime;
        const duration = art.duration;

        if (currentSkiptime) {
          if (
            currentTime > currentSkiptime.intro.start &&
            currentTime < currentSkiptime.intro.end
          ) {
            if (autoskipIntro) {
              art.currentTime = currentSkiptime.intro.end;
            }
          }

          if (
            currentTime > currentSkiptime.outro.start &&
            currentTime < currentSkiptime.outro.end
          ) {
            if (autoskipIntro) {
              art.currentTime = currentSkiptime.outro.end;
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
    [
      autoplay,
      autonext,
      currentSkiptime,
      ep,
      episodeServer,
      infoId,
      nextEp,
      router,
      autoskipIntro,
    ]
  );

  return (
    <>
      <div className="relative">
        {!streamingLink?.sources && !isLoading ? (
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
              currentSkiptime={currentSkiptime}
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
                miniProgressBar: true,
                mutex: true,
                backdrop: true,
                playsInline: true,
                autoPlayback: true,
                airplay: true,
              }}
              key={defaultUrl?.url}
              getInstance={getInstance}
            />
          </>
        )}
      </div>

      <PlayerSettings
        episodeServer={episodeServer}
        setAutoplay={setAutoplay}
        autoplay={autoplay}
        setAutonext={setAutonext}
        autonext={autonext}
        setAutoskipIntro={setAutoskipIntro}
        autoskipIntro={autoskipIntro}
        setServer={setServer}
        server={server}
        setCategory={setCategory}
        category={category}
        nextEp={nextEp?.episodeId}
        prevEp={prevEp?.episodeId}
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
