"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useRef } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

interface TrendingAnimeProp {
  trending: {
    rank: number;
    name: string;
    id: string;
    poster: string;
  }[];
}

const TrendingAnime = ({ trending }: TrendingAnimeProp) => {
  const swiperRef = useRef<SwiperRef>(null);

  return (
    <div className="relative flex items-center mt-5">
      <button
        onClick={() => swiperRef.current?.swiper.slidePrev()}
        className="absolute left-[-.3rem] bg-white text-black scale-[1.2] p-2 rounded-full z-[10]"
      >
        <FaChevronLeft />
      </button>
      <Swiper
        breakpoints={{
          100: {
            slidesPerView: 2,
          },
          500: {
            slidesPerView: 3,
          },
          620: {
            slidesPerView: 4,
          },
          880: {
            slidesPerView: 5,
          },
          1140: {
            slidesPerView: 6,
          },
          1330: {
            slidesPerView: 7,
          },
        }}
        spaceBetween={8}
        ref={swiperRef}
      >
        {trending.map((trend) => (
          <SwiperSlide key={trend.id}>
            <Link href={`/${trend.id}`}>
              <div className="relative mb-2 overflow-hidden rounded-lg">
                <div
                  className={cn(
                    "absolute left-[-4.3rem] rotate-[-50deg] p-2 w-[11rem] flex justify-center z-[10]",
                    trend.rank === 1
                      ? "bg-yellow-500"
                      : trend.rank === 2
                      ? "bg-green-500"
                      : trend.rank === 3
                      ? "bg-blue-500"
                      : "bg-red-500"
                  )}
                >
                  <p className="rotate-[48deg]">#{trend.rank}</p>
                </div>
                <Image
                  src={trend.poster}
                  alt="poster"
                  width={500}
                  height={500}
                  priority
                  className="w-full h-[14rem] object-cover transition-all duration-200 lg:hover:scale-[1.03]"
                />
              </div>
            </Link>
            <div>
              <p className="truncate">{trend.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        onClick={() => swiperRef.current?.swiper.slideNext()}
        className="absolute right-[-.3rem] bg-white text-black scale-[1.2] p-2 rounded-full z-[10]"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default TrendingAnime;
