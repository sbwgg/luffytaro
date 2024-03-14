import { useEffect, useMemo, useRef } from "react";
import Artplayer from "artplayer";
import { playM3u8 } from "@/utils/art-player-hls-options";
import { StreamingLinkType } from "./videoPlayerRow";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";

type PlayerProp = {
  streamingLink: StreamingLinkType | null;
  option: {
    id: string;
    poster: string;
    url: string;
    volume: number;
    isLive: boolean;
    muted: boolean;
    autoplay: boolean;
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
    fastForward: boolean;
    backdrop: boolean;
    playsInline: boolean;
    autoPlayback: boolean;
    airplay: boolean;
  };
  getInstance: (art: Artplayer) => void;
};

export default function Player({
  streamingLink,
  option,
  getInstance,
}: PlayerProp) {
  const artRef = useRef(null);

  const filteresSub = streamingLink?.tracks.filter(
    (item) => item.kind !== "Thumbnails"
  );

  const sub = filteresSub?.map(({ label, file }) => ({
    default: label === "English",
    html: label,
    url: file,
  }));

  const intro = useMemo(() => {
    const currentIntro = [];
    if (streamingLink) {
      for (
        let i = streamingLink.intro.start;
        i < streamingLink.intro.end;
        i++
      ) {
        currentIntro.push({ time: i, text: "Intro" });
      }
    }
    return currentIntro;
  }, [streamingLink]);

  const outro = useMemo(() => {
    const currentOutro = [];
    if (streamingLink) {
      for (
        let i = streamingLink.outro.start;
        i < streamingLink.outro.end;
        i++
      ) {
        currentOutro.push({ time: i, text: "Outro" });
      }
    }
    return currentOutro;
  }, [streamingLink]);

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
