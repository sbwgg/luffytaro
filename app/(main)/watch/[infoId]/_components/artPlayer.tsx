import { useEffect, useMemo, useRef } from "react";
import Artplayer from "artplayer";
import { playM3u8 } from "@/utils/art-player-hls-options";
import { StreamingLinkType } from "./videoPlayerRow";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";

type PlayerProp = {
  streamingLink: StreamingLinkType | null;
  currentSkiptime:
    | {
        intro: {
          end: number;
          start: number;
        };
        outro: {
          end: number;
          start: number;
        };
        number: number;
      }
    | undefined;
  option: {
    id: string;
    poster: string;
    url: string;
    volume: number;
    isLive: boolean;
    muted: boolean;
    autoplay: false;
    pip: boolean;
    autoSize: boolean;
    autoMini: boolean;
    screenshot: boolean;
    setting: boolean;
    loop: boolean;
    flip: boolean;
    playbackRate: boolean;
    aspectRatio: boolean;
    fullscreen: boolean;
    fullscreenWeb: boolean;
    subtitleOffset: boolean;
    miniProgressBar: boolean;
    mutex: boolean;
    backdrop: boolean;
    playsInline: boolean;
    autoPlayback: boolean;
    airplay: boolean;
  };
  getInstance: (art: Artplayer) => void;
};

export default function Player({
  streamingLink,
  currentSkiptime,
  option,
  getInstance,
}: PlayerProp) {
  const artRef = useRef(null);

  const filteresSub = streamingLink?.subtitles.filter(
    (item) => item.lang !== "Thumbnails"
  );

  const sub = filteresSub?.map(({ lang, url }) => ({
    default: lang === "English",
    html: lang,
    url,
  }));

  const intro = useMemo(() => {
    const currentIntro = [];
    if (currentSkiptime) {
      for (
        let i = currentSkiptime.intro.start;
        i < currentSkiptime.intro.end;
        i++
      ) {
        currentIntro.push({ time: i, text: "Intro" });
      }
    }
    return currentIntro;
  }, [currentSkiptime]);

  const outro = useMemo(() => {
    const currentOutro = [];
    if (currentSkiptime) {
      for (
        let i = currentSkiptime.outro.start;
        i < currentSkiptime.outro.end;
        i++
      ) {
        currentOutro.push({ time: i, text: "Outro" });
      }
    }
    return currentOutro;
  }, [currentSkiptime]);

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current!,
      type: "m3u8",
      customType: {
        m3u8: playM3u8,
      },
      theme: "red",
      lang: navigator.language.toLowerCase(),
      moreVideoAttr: {
        crossOrigin: "anonymous",
      },
      plugins: [
        artplayerPluginHlsQuality({
          setting: true,

          getResolution: (level) => level.height + "P",

          title: "Quality",
          auto: "Auto",
        }),
      ],
      settings: sub?.length
        ? [
            {
              width: 200,
              html: "Subtitle",
              tooltip: `${
                sub?.find((item) => item.default === true)?.html || "English"
              }`,
              selector: [
                {
                  html: "Display",
                  tooltip: "Show",
                  switch: true,
                  onSwitch: function (item) {
                    item.tooltip = item.switch ? "Hide" : "Show";
                    art.subtitle.show = !item.switch;
                    return !item.switch;
                  },
                },
                ...(sub as { default: boolean; html: string; url: string }[]),
              ],
              onSelect: function (item) {
                art.subtitle.switch(item.url, {
                  name: item.html,
                });
                return item.html;
              },
            },
          ]
        : [],
      subtitle: {
        url: `${sub?.find((item) => item.default === true)?.url}`,
        type: "srt",
        style: {
          fontSize: "20px",
        },
        encoding: "utf-8",
      },
      highlight: [...intro, ...outro],
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [option, getInstance, sub, intro, outro]);

  return <div className="aspect-video mb-2" ref={artRef}></div>;
}
