"use client";

import Image from "next/image";
import React from "react";
import LuffyTaro from "@/image/wp11567850.webp";
import Link from "next/link";
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

const Footer = () => {
  return (
    <div className="flex flex-col items-center px-3 py-5 lg:px-10 mt-24 border-t border-zinc-800">
      <div className="flex items-center gap-x-3">
        <Image
          src={LuffyTaro}
          alt="image"
          width={100}
          height={100}
          className="w-[2.4rem] h-[2.4rem] md:w-[2.9rem] md:h-[2.9rem] rounded-full"
          priority
        />
        <Link href="/" className="text-sm md:text-xl font-medium">
          bertoo.pro
        </Link>
      </div>

      <div className="mt-5">
        <p className="text-zinc-500 text-center text-sm">
          Bertoo.pro does not store any files on our server, we only linked to
          the media which is hosted on 3rd party services.
        </p>
      </div>

      <div className="space-x-1 mt-5">
        <FacebookShareButton
          url={process.env.NEXT_PUBLIC_MAIN_URL!}
          hashtag="#sharebertoo"
        >
          <FacebookIcon round className="sm:w-[3rem] w-[2.5rem]" />
        </FacebookShareButton>

        <FacebookMessengerShareButton
          url={process.env.NEXT_PUBLIC_MAIN_URL!}
          appId="768928146800344"
        >
          <FacebookMessengerIcon round className="sm:w-[3rem] w-[2.5rem]" />
        </FacebookMessengerShareButton>

        <RedditShareButton url={process.env.NEXT_PUBLIC_MAIN_URL!}>
          <RedditIcon round className="sm:w-[3rem] w-[2.5rem]" />
        </RedditShareButton>

        <TelegramShareButton url={process.env.NEXT_PUBLIC_MAIN_URL!}>
          <TelegramIcon round className="sm:w-[3rem] w-[2.5rem]" />
        </TelegramShareButton>

        <TwitterShareButton url={process.env.NEXT_PUBLIC_MAIN_URL!}>
          <TwitterIcon round className="sm:w-[3rem] w-[2.5rem]" />
        </TwitterShareButton>
      </div>
    </div>
  );
};

export default Footer;