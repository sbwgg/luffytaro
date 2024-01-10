"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { EpisodeServerType, SkiptimeType } from "../page";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/base.css";
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  Track,
  useMediaStore,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import axios from "axios";
import PlayerSettings from "./playerSettings";
import { useLocalStorage } from "@uidotdev/usehooks";
import { EpisodeType } from "@/app/(main)/[infoId]/_components/animeInfo";
import { useRouter } from "next/navigation";
import { TbFaceIdError } from "react-icons/tb";
import { AnimeInfoType, MetaAnilistInfoType } from "@/app/(main)/[infoId]/page";
import NextEpisodeTime from "@/components/nextEpisodeTime";

interface VideoPlayerRowProp {
  episodeServer: EpisodeServerType;
  animeEpisodes: EpisodeType;
  skiptime: SkiptimeType;
  infoId: string;
  ep: string;
  metaAnilistInfo: MetaAnilistInfoType;
  animeInfo: AnimeInfoType;
}

interface StreamingLinkType {
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
  animeInfo,
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
  const [showSkipbutton, setShowSkipbutton] = useState({
    intro: false,
    outro: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [watchedTime, setWatchedTime] = useLocalStorage<WatchedTimeType[]>(
    "watched-time",
    []
  );
  const playerRef = useRef<MediaPlayerInstance>(null),
    { duration } = useMediaStore(playerRef);

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

  const thumbnails = streamingLink?.subtitles?.find(
    (thum) => thum.lang === "Thumbnails"
  );
  const currentSkiptime = skiptime?.episodes?.find(
    (num) => num?.number === episodeServer?.episodeNo
  );
  const storedWatchTime = watchedTime?.find((time) => time?.ep === ep);

  const currentEpWatching = animeEpisodes?.episodes?.findIndex(
    (item) => item?.episodeId === episodeServer?.episodeId
  );
  const nextEp = animeEpisodes?.episodes[currentEpWatching + 1];
  const prevEp = animeEpisodes?.episodes[currentEpWatching - 1];

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
          <MediaPlayer
            playsinline
            aspectRatio="16/9"
            ref={playerRef}
            key={episodeServer.episodeId}
            title={animeInfo.anime.info.name}
            src={defaultUrl?.url || ""}
            onEnd={() => {
              setWatchedTime((prev) => prev.filter((item) => item.ep !== ep));

              if (autonext) {
                router.push(`/watch/${nextEp.episodeId}`);
              }
            }}
            autoplay={autoplay}
            onStarted={() => {
              if (storedWatchTime?.currentTime) {
                playerRef.current!.currentTime = storedWatchTime?.currentTime;
              }
            }}
            onTimeUpdate={(detail) => {
              const currentTime = detail.currentTime;

              if (
                currentSkiptime &&
                currentTime >= currentSkiptime.intro.start &&
                currentTime <= currentSkiptime.intro.end
              ) {
                if (autoskipIntro) {
                  playerRef.current!.currentTime = currentSkiptime.intro.end;
                } else {
                  setShowSkipbutton((prev) => ({ ...prev, intro: true }));
                }
              } else {
                setShowSkipbutton((prev) => ({ ...prev, intro: false }));
              }

              if (
                currentSkiptime &&
                currentTime >= currentSkiptime.outro.start &&
                currentTime <= currentSkiptime.outro.end
              ) {
                if (autoskipIntro) {
                  playerRef.current!.currentTime = currentSkiptime.outro.end;
                } else {
                  setShowSkipbutton((prev) => ({ ...prev, outro: true }));
                }
              } else {
                setShowSkipbutton((prev) => ({ ...prev, outro: false }));
              }

              if (currentTime > 1) {
                setWatchedTime((prev) =>
                  !prev.some((item) => item.ep === ep)
                    ? [
                        ...prev,
                        {
                          currentTime: Math.floor(currentTime),
                          endTime: Math.floor(duration),
                          episodeNo: episodeServer.episodeNo,
                          infoId,
                          ep,
                          lastViewed: true,
                        },
                      ]
                    : prev.map((item) =>
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
                      )
                );
              }
            }}
          >
            <MediaProvider>
              {streamingLink?.subtitles
                ?.filter((sub) => sub.lang !== "Thumbnails")
                .map((sub, i) => (
                  <Fragment key={i}>
                    <Track
                      src={sub.url}
                      kind="subtitles"
                      label={sub.lang}
                      lang={sub.lang}
                      default={sub.lang === "English"}
                    />
                  </Fragment>
                ))}
            </MediaProvider>
            {showSkipbutton?.intro || showSkipbutton?.outro ? (
              <button
                onClick={() => {
                  currentSkiptime
                    ? showSkipbutton.intro
                      ? (playerRef.current!.currentTime =
                          currentSkiptime?.intro.end)
                      : (playerRef.current!.currentTime =
                          currentSkiptime?.outro.end)
                    : null;
                }}
                className="absolute bottom-[4.8rem] sm:bottom-[5.5rem] left-[.7rem] sm:left-5 sm:text-base text-sm p-1 px-3 bg-white text-black z-[100]"
              >
                Skip {showSkipbutton.intro ? "Intro" : "Outro"}
              </button>
            ) : null}
            <DefaultVideoLayout
              thumbnails={thumbnails?.url}
              icons={defaultLayoutIcons}
            />
          </MediaPlayer>
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

      {metaAnilistInfo.nextAiringEpisode ? (
        <div className="text-sm mt-5 text-zinc-400 lg:px-0 px-3">
          <NextEpisodeTime
            nextAiringEpisode={metaAnilistInfo?.nextAiringEpisode}
          />
        </div>
      ) : (
        <div className="mt-5 text-zinc-400 text-sm lg:px-0 px-3">
          <p>Aired time: Finish airing</p>
        </div>
      )}
    </>
  );
};

export default VideoPlayerRow;
