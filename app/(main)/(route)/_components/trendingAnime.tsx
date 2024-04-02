"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useRef } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import "@fontsource/roboto";

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
        className="absolute left-[-.3rem] bg-white text-black scale-[1.5] p-3 rounded-full z-[10]"
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
        {trending.map((trend, index) => (
          <SwiperSlide key={trend.id}>
            <Link href={`/${trend.id}`}>
              <div className="relative mb-2 overflow-hidden">
                <div
                  className={cn(
                    "absolute left-0 bg-transparent text-black p-2 px-4 flex justify-center z-[10]",
                    // Apply red, orange, yellow color to the first three items
                    index < 3 ? `text-${['red', 'orange', 'yellow'][index]}` : 'text-white'
                  )}
                  style={{ // Add outline and shadow to the text
                    fontSize: "1.5rem", // Larger font size
                    zIndex: 10,
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                    fontFamily: "Roboto, sans-serif", // Use Roboto font
                    WebkitTextStroke: "1px black", // Add outline stroke
                  }}
                >
                  <p className="relative">
                    <span className={`outline-${index < 3 ? ['red', 'orange', 'yellow'][index] : 'white'}`}>{`#${trend.rank}`}</span>
                  </p>
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
              <p className="truncate text-sm">{trend.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        onClick={() => swiperRef.current?.swiper.slideNext()}
        className="absolute right-[-.3rem] bg-white text-black scale-[1.5] p-3 rounded-full z-[10]"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default TrendingAnime;