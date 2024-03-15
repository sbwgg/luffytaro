"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { TiChevronRight, TiChevronLeft } from "react-icons/ti";
import "swiper/swiper-bundle.css";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import EstimatedScheduleCard from "./estimatedScheduleCard";
import { FiLoader } from "react-icons/fi";

interface MonthDatesType {
  date: string;
  value: string;
  day: string;
}

interface ScheduleType {
  scheduledAnimes: {
    id: string;
    jname: string;
    name: string;
    time: string;
  }[];
}

const EstimatedSchedule = () => {
  const [monthDates, setMonthDates] = useState<MonthDatesType[]>([]);
  const [defaultDate, setDefaultDate] = useState("");
  const [showAll, setShowAll] = useState(6);
  const ref = useRef<SwiperRef>(null);

  useEffect(() => {
    const today = new Date();

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const defaultDate = firstDayOfMonth.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    setDefaultDate(defaultDate);

    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    const datesArray = [];

    for (
      let day = firstDayOfMonth;
      day <= lastDayOfMonth;
      day.setDate(day.getDate() + 1)
    ) {
      const dayOfWeek = day.getDay();
      const dateValue = day.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      datesArray.push({
        date: day.toLocaleDateString([], { dateStyle: "full" }).split(",")[1],
        value: dateValue,
        day: getDayName(dayOfWeek),
      });
    }

    setMonthDates(datesArray);
  }, []);

  const getDayName = (dayIndex: number) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[dayIndex];
  };

  const {
    data: schedule,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["schedule", defaultDate],
    enabled: defaultDate !== "",
    queryFn: async () => {
      try {
        const res = await axios.get<ScheduleType>(
          `https://api-aniwatch.onrender.com/anime/schedule?date=${defaultDate}`
        );
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <div className="mt-5">
      <div className="relative flex items-center justify-center md:w-auto swiperScheduleBreakPoints mx-auto mt-10 mb-4 flex-1">
        <button
          onClick={() => ref.current?.swiper?.slidePrev()}
          className="absolute -left-2 bg-white z-[50] p-2 rounded-full text-black"
        >
          <TiChevronLeft />
        </button>
        <Swiper
          ref={ref}
          spaceBetween={8}
          breakpoints={{
            100: {
              slidesPerView: 3,
            },
            500: {
              slidesPerView: 4,
            },
            700: {
              slidesPerView: 5,
            },
            900: {
              slidesPerView: 6,
            },
            1120: {
              slidesPerView: 7,
            },
            1366: {
              slidesPerView: 8,
            },
          }}
        >
          {monthDates.map((date) => (
            <SwiperSlide key={date.date}>
              <button
                onClick={() => setDefaultDate(date.value)}
                className={cn(
                  "flex items-center flex-col p-2 w-full duration-200 transition-all",
                  defaultDate === date.value ? "bg-red-500 " : "bg-zinc-700/40"
                )}
              >
                <span className="font-semibold uppercase sm:text-base text-sm mb-1">
                  {date.day.slice(0, 3)}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    defaultDate === date.value ? "text-white" : "text-zinc-400"
                  )}
                >
                  {date.date.split(" ")[1].slice(0, 3)}{" "}
                  {date.date.split(" ")[2]}
                </span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          onClick={() => ref.current?.swiper?.slideNext()}
          className="absolute -right-2 bg-white z-[50] p-2 rounded-full text-black"
        >
          <TiChevronRight />
        </button>
      </div>

      {schedule && schedule?.scheduledAnimes?.length === 0 ? (
        <div className="min-h-[40dvh] flex items-center justify-center text-zinc-400">
          No results
        </div>
      ) : (
        <div className="relative">
          {schedule &&
            schedule.scheduledAnimes.length > 6 &&
            showAll <= 6 &&
            !isLoading && (
              <div
                className={cn(
                  "flex items-end justify-center h-[12rem] from-black to-transparent absolute bottom-0 inset-x-0 z-[90]",
                  showAll > 6 ? "" : "bg-gradient-to-t"
                )}
              >
                <button onClick={() => setShowAll(500)}>Show all</button>
              </div>
            )}
          {isSuccess &&
            schedule?.scheduledAnimes
              ?.slice(0, showAll)
              .map((sched) => (
                <EstimatedScheduleCard key={sched.id} sched={sched} />
              ))}
          {isLoading && (
            <div className="flex items-center justify-center min-h-[40dvh]">
              <FiLoader className="animate-spin text-3xl text-zinc-500" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EstimatedSchedule;
