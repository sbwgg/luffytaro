import React from "react";
const VideoPlayerRow = dynamic(() => import("./_components/videoPlayerRow"), {
  ssr: false,
});
import { EpisodeType } from "../../[infoId]/_components/animeInfo";
import EpisodeRow from "./_components/episodeRow";
import "./_components/watch.css";
import dynamic from "next/dynamic";
import { AnimeInfoType, MetaAnilistInfoType } from "../../[infoId]/page";
import MoreSeasons from "./_components/moreSeasons";
import GridCardAnime from "@/components/gridCardAnime";
import MostPopularAnime from "@/components/mostPopularAnime";
import RelatedAnime from "@/components/relatedAnime";
import AnimeDetails from "./_components/animeDetails";
const CommentRow = dynamic(() => import("./_components/commentRow"), {
  ssr: false,
});

export interface EpisodeServerType {
  sub: {
    serverName: string;
    serverId: number;
  }[];
  dub: {
    serverName: string;
    serverId: number;
  }[];
  episodeId: string;
  episodeNo: number;
}

export interface SkiptimeType {
  id: string;
  episodes: {
    intro: {
      end: number;
      start: number;
    };
    outro: {
      end: number;
      start: number;
    };
    number: number;
  }[];
}

const getAnimeInfo = async (infoId: string) => {
  const res = await fetch(
    `${process.env.ANIWATCH_URL}/anime/info/?id=${infoId}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch anime info");
  }
  return res.json();
};

const getAnimeEpisodes = async (infoId: string) => {
  const res = await fetch(
    `${process.env.ANIWATCH_URL}/anime/episodes/${infoId}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch anime episodes");
  }
  return res.json();
};

const getEpisodeServer = async (infoId: string, ep: string) => {
  const res = await fetch(
    `${process.env.ANIWATCH_URL}/anime/servers?episodeId=${infoId}?ep=${ep}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch episode server");
  }
  return res.json();
};

const getMetaAnilistInfo = async (alID: string) => {
  const res = await fetch(
    `${process.env.CONSUMET_URL}/meta/anilist/info/${alID}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    return null;
  }
  return res.json();
};

const getBannerImage = async (alID: string) => {
  const res = await fetch(`https://api.anify.tv/info/${alID}`, {
    cache: "no-store",
  });
  const contentType = res.headers.get("Content-Type");

  if (contentType !== "application/json") {
    return { bannerImage: "" };
  }

  if (!res.ok) {
    return null;
  }

  res.json();
};

export const generateMetadata = async ({
  params,
}: {
  params: { infoId: string };
}) => {
  const animeInfo: AnimeInfoType = await getAnimeInfo(params.infoId);

  return {
    title: `Watch ${animeInfo?.anime?.info?.name} Sub/Dub for free on bertoo.pro`,
  };
};

const WatchPage = async ({
  params,
  searchParams,
}: {
  params: { infoId: string };
  searchParams: { ep: string };
}) => {
  const { infoId } = params;
  const { ep } = searchParams;
  const animeInfo: AnimeInfoType = await getAnimeInfo(infoId);
  const animeEpisodes: EpisodeType = await getAnimeEpisodes(infoId);
  const episodeServer: EpisodeServerType = await getEpisodeServer(infoId, ep);
  const { alID }: { alID: string } = await fetch(
    `${process.env.CONSUMET_URL}/anime/zoro/info?id=${params.infoId}`,
    {
      next: {
        revalidate: 60,
      },
    }
  ).then((res) => res.json());
  const metaAnilistInfo: MetaAnilistInfoType = await getMetaAnilistInfo(alID);

  const bannerImage = await getBannerImage(alID);

  return (
    <div className="pt-20">
      <div className="lg:flex lg:px-10 ">
        <div className="flex-1">
          <VideoPlayerRow
            episodeServer={episodeServer}
            animeEpisodes={animeEpisodes}
            infoId={infoId}
            ep={ep}
            metaAnilistInfo={metaAnilistInfo}
            bannerImage={bannerImage?.bannerImage}
            animeInfo={animeInfo}
          />
        </div>
        <div className="basis-[19.4rem] flex flex-col px-3 lg:mt-0 mt-5 rounded-md">
          <EpisodeRow animeEpisodes={animeEpisodes} ep={ep} infoId={infoId} />
        </div>
      </div>

      <MoreSeasons seasons={animeInfo.seasons} />
      <AnimeDetails
        animeInfo={animeInfo}
        totalEpisodes={animeEpisodes.totalEpisodes}
      />

      <div className="lg:flex gap-x-4 px-3 lg:px-10 mt-12">
        <div className="flex-1">
          <div className="mb-10">
            <h1 className="sm:text-xl cursor-pointer mb-5">
              <span className="p-1 mr-3 bg-red-500 rounded-lg" />
              Comments
            </h1>

            <CommentRow identifier={ep} title={animeInfo.anime.info.name} />
          </div>

          <div>
            <h1 className="sm:text-xl cursor-pointer">
              <span className="p-1 mr-3 bg-red-500 rounded-lg" />
              RECOMMENDED FOR YOU
            </h1>

            <div className="gridCard gap-x-2 gap-y-8 mt-5">
              {animeInfo?.recommendedAnimes.map((recommend) => (
                <GridCardAnime key={recommend.id} anime={recommend} />
              ))}
            </div>
          </div>
        </div>

        <div className="basis-[19.5rem] lg:mt-0 mt-10">
          {animeInfo.relatedAnimes.length ? (
            <div>
              <h1 className="sm:text-xl cursor-pointer">
                <span className="p-1 mr-3 bg-red-500 rounded-lg" />
                RELATED ANIME
              </h1>

              <RelatedAnime relatedAnime={animeInfo.relatedAnimes} />
            </div>
          ) : null}

          {animeInfo.mostPopularAnimes.length ? (
            <div className="mt-10">
              <h1 className="sm:text-xl cursor-pointer">
                <span className="p-1 mr-3 bg-red-500 rounded-lg" />
                MOST POPULAR
              </h1>

              <div className="mt-5 bg-zinc-900 px-4 py-2">
                {animeInfo.mostPopularAnimes.map((mostPopular, i) => (
                  <MostPopularAnime
                    key={mostPopular.id}
                    mostPopular={mostPopular}
                    index={i}
                    length={animeInfo.mostPopularAnimes.length - 1}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
