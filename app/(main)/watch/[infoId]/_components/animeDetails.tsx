"use client";

import { AnimeInfoType } from "@/app/(main)/[infoId]/page";
import Image from "next/image";
import React, { useState } from "react";
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

interface AnimeDetailsProp {
  animeInfo: AnimeInfoType;
}

const AnimeDetails = ({ animeInfo }: AnimeDetailsProp) => {
  const [seemore, setSeemore] = useState<number | undefined>(350);

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

        <div>
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
          <p className="text-sm text-zinc-400">
            {animeInfo?.anime?.info?.description.slice(0, seemore) +
              `${
                animeInfo?.anime?.info?.description.slice(0, seemore)?.length >
                350
                  ? ""
                  : "..."
              }`}{" "}
            {animeInfo?.anime?.info?.description?.length > 350 && (
              <span
                onClick={() => setSeemore((prev) => (!prev ? 350 : undefined))}
                className="font-semibold cursor-pointer"
              >
                {seemore ? "see more+" : "see less-"}
              </span>
            )}
          </p>

          <button className="mt-2 text-xs p-1 px-3 bg-white text-black font-medium">
            <Link
              href={`/${animeInfo.anime.info.id}`}
              className="flex items-center gap-x-1"
            >
              <IoMdInformationCircle />
              MORE DETAILS
            </Link>
          </button>

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
};

export default AnimeDetails;
