"use client";

import { AnimeInfoType } from "@/app/(main)/[infoId]/page";
import Image from "next/image";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { FaClosedCaptioning, FaMicrophone } from "react-icons/fa6";
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  RedditShareButton,
  RedditIcon,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "next-share";
import Link from "next/link";
import { IoMdInformationCircle } from "react-icons/io";
import { cn } from "@/lib/utils";

interface AnimeDetailsProp {
  animeInfo: AnimeInfoType;
  totalEpisodes: number;
}

export default function AnimeDetails({
  animeInfo,
  totalEpisodes,
}: AnimeDetailsProp) {
  return (
    <>
      <div className="flex sm:flex-row flex-col sm:items-start items-center gap-4 lg:px-10 px-3 mt-5">
        <Image
          src={animeInfo.anime.info.poster}
          alt="poster"
          width={400}
          height={100}
          priority
          className="w-[5rem] h-[7rem] object-cover"
        />

        <div className="flex-1">
          <p className="text-lg text-center sm:text-start font-semibold mb-2">
            {animeInfo?.anime?.info?.name}
          </p>
          <div className="flex items-center md:justify-start justify-center gap-x-3 mb-3 text-sm">
            <p className="flex items-center gap-x-1">
              {animeInfo?.anime?.info?.stats?.rating}
            </p>
            <p className="flex items-center gap-x-1 text-xs bg-red-500 p-1 px-2 rounded">
              {animeInfo?.anime?.info?.stats?.quality}
            </p>
            {animeInfo?.anime?.info.stats.episodes.sub && (
              <p className="flex items-center gap-x-1">
                <FaClosedCaptioning />
                {animeInfo?.anime?.info?.stats?.episodes.sub}
              </p>
            )}
            {animeInfo?.anime?.info.stats.episodes.dub && (
              <p className="flex items-center gap-x-1">
                <FaMicrophone />
                {animeInfo?.anime?.info?.stats?.episodes.dub}
              </p>
            )}
            <p className="flex items-center gap-x-1">
              {animeInfo?.anime?.info?.stats?.type}
            </p>
            <p className="flex items-center gap-x-1">
              {animeInfo?.anime?.info?.stats?.duration}
            </p>
          </div>

          <AnimeInfos animeInfo={animeInfo} totalEpisodes={totalEpisodes} />

          <div className="flex items-center gap-x-2 mt-5">
            <h1 className="text-sm">Share this anime to your friend:</h1>
            <FacebookShareButton
              url={process.env.NEXT_PUBLIC_MAIN_URL!}
              hashtag="#shareLuffyTaro"
            >
              <FacebookIcon round className="w-[2.5rem] h-[2.5rem]" />
            </FacebookShareButton>

            <FacebookMessengerShareButton
              url={process.env.NEXT_PUBLIC_MAIN_URL!}
              appId="768928146800344"
            >
              <FacebookMessengerIcon round className="w-[2.5rem] h-[2.5rem]" />
            </FacebookMessengerShareButton>

            <RedditShareButton url={process.env.NEXT_PUBLIC_MAIN_URL!}>
              <RedditIcon round className="w-[2.5rem] h-[2.5rem]" />
            </RedditShareButton>

            <TelegramShareButton url={process.env.NEXT_PUBLIC_MAIN_URL!}>
              <TelegramIcon round className="w-[2.5rem] h-[2.5rem]" />
            </TelegramShareButton>

            <TwitterShareButton url={process.env.NEXT_PUBLIC_MAIN_URL!}>
              <TwitterIcon round className="w-[2.5rem] h-[2.5rem]" />
            </TwitterShareButton>
          </div>
        </div>
      </div>
    </>
  );
}

function AnimeInfos({
  animeInfo,
  totalEpisodes,
}: {
  animeInfo: AnimeInfoType;
  totalEpisodes: number;
}) {
  const [seemore, setSeemore] = useState(false);
  const ref = useRef<ElementRef<"p">>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setShow(ref.current.scrollHeight !== ref.current.clientHeight);
    }
  }, []);

  return (
    <>
      <div className="flex xl:flex-row flex-col gap-8">
        <div className="flex-1">
          <div className="text-sm text-zinc-400">
            <p ref={ref} className={cn(seemore ? "" : "line-clamp-4")}>
              {animeInfo.anime.info.description}
            </p>
            {show && (
              <button
                onClick={() => setSeemore(!seemore)}
                className="text-xs border border-zinc-700 bg-zinc-800 p-1 mt-1"
              >
                <span
                  onClick={() => setSeemore(!seemore)}
                  className="font-semibold cursor-pointer"
                >
                  {!seemore ? "see more+" : "see less-"}
                </span>
              </button>
            )}
          </div>
          <button className="mt-5 text-xs p-1 px-3 bg-white text-black font-medium">
            <Link
              href={`/${animeInfo.anime.info.id}`}
              className="flex items-center gap-x-1"
            >
              <IoMdInformationCircle />
              MORE DETAILS
            </Link>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-[13.5px] xl:max-w-[40rem]">
          <ul className="space-y-1">
            <li className="flex">
              <p className="text-zinc-500 w-[7rem]">Type:</p>{" "}
              <p className="text-zinc-300">{animeInfo.anime.info.stats.type}</p>
            </li>

            <li className="flex">
              <p className="text-zinc-500 w-[7rem]">Premiered:</p>{" "}
              <p className="text-zinc-300">
                {animeInfo.anime.moreInfo.premiered}
              </p>
            </li>

            <li className="flex">
              <p className="text-zinc-500 w-[7rem]">Status:</p>{" "}
              <p className="text-zinc-300">{animeInfo.anime.moreInfo.status}</p>
            </li>

            <li className="flex">
              <p className="text-zinc-500 w-[7rem]">Status:</p>{" "}
              <p className="text-zinc-300">{animeInfo.anime.moreInfo.status}</p>
            </li>

            <li className="flex">
              <p className="text-zinc-500 w-[7rem]">Duration:</p>{" "}
              <p className="text-zinc-300">
                {animeInfo.anime.moreInfo.duration}
              </p>
            </li>

            <li className="flex">
              <p className="text-zinc-500 w-[7rem]">Studios:</p>{" "}
              <p className="text-zinc-300">
                {animeInfo.anime.moreInfo.studios}
              </p>
            </li>

            <li className="flex">
              <p className="text-zinc-500 w-[7rem] shrink-0">Producers:</p>{" "}
              <p className="flex flex-wrap text-zinc-300">
                {animeInfo.anime.moreInfo.producers.join(", ")}
              </p>
            </li>
          </ul>

          <ul className="space-y-1">
            <li className="flex">
              <p className="text-zinc-500 w-[7rem] shrink-0">Date aired:</p>{" "}
              <p className="flex flex-wrap text-zinc-300">
                {animeInfo.anime.moreInfo.aired}
              </p>
            </li>
            <li className="flex">
              <p className="text-zinc-500 w-[7rem] shrink-0">MAL:</p>{" "}
              <p className="flex flex-wrap text-zinc-300">
                {animeInfo.anime.moreInfo.malscore}
              </p>
            </li>
            <li className="flex">
              <p className="text-zinc-500 w-[7rem] shrink-0">Episodes:</p>{" "}
              <p className="flex flex-wrap text-zinc-300">{totalEpisodes}</p>
            </li>
            <li className="flex">
              <p className="text-zinc-500 w-[7rem] shrink-0">Genre:</p>{" "}
              <p className="flex flex-wrap text-zinc-300 whitespace-pre-wrap">
                {animeInfo.anime.moreInfo.genres.join(", ")}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
