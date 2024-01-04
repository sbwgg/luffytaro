"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import SpotlightAnimeCard from "./spotlightAnimeCard";

export interface SpotlightAnimeProp {
  spotlight: {
    rank: number;
    id: string;
    name: string;
    description: string;
    poster: string;
    jname: string;
    episodes: {
      sub: number;
      dub: number;
    };
    otherInfo: string[];
  }[];
}

const SpotlightAnime = ({ spotlight }: SpotlightAnimeProp) => {
  return (
    <Swiper
      modules={[Autoplay]}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
    >
      {spotlight.map((s) => (
        <SwiperSlide key={s.id}>
          <SpotlightAnimeCard s={s} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SpotlightAnime;
