"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { HiMiniChevronRight, HiMiniChevronLeft } from "react-icons/hi2";
import {
  HiMiniChevronDoubleRight,
  HiMiniChevronDoubleLeft,
} from "react-icons/hi2";

const Pagination = ({
  totalPages,
  page,
  url,
}: {
  totalPages: number;
  page: number;
  url: string;
}) => {
  const paginationNo = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationNo.push(i);
  }

  return (
    <div className="flex items-center lg:gap-x-2 gap-1 text-xs">
      {page.toString() !== "1" && (
        <>
          <Link
            href={`${url}page=${1}`}
            className="flex items-center justify-center bg-zinc-800 lg:h-[2.5rem] lg:w-[2.5rem] h-[2rem] w-[2rem] rounded-full"
          >
            <HiMiniChevronDoubleLeft />
          </Link>
          <Link
            href={`${url}page=${page - 1}`}
            className="flex items-center justify-center bg-zinc-800 lg:h-[2.5rem] lg:w-[2.5rem] h-[2rem] w-[2rem] rounded-full"
          >
            <HiMiniChevronLeft />
          </Link>
        </>
      )}

      <div className="flex items-center lg:gap-x-2 gap-1">
        {paginationNo
          .filter((no) => no >= page - 2 && no <= page + 2)
          .map((no) => (
            <Link
              href={`${url}page=${no}`}
              key={no}
              className={cn(
                "flex items-center justify-center lg:h-[2.5rem] lg:w-[2.5rem] h-[2rem] w-[2rem] rounded-full shrink-0",
                no === page ? "bg-red-500" : "bg-zinc-800"
              )}
            >
              {no}
            </Link>
          ))}
      </div>

      {page !== totalPages && (
        <>
          <Link
            href={`${url}page=${page + 1}`}
            className="flex items-center justify-center bg-zinc-800 lg:h-[2.5rem] lg:w-[2.5rem] h-[2rem] w-[2rem] rounded-full"
          >
            <HiMiniChevronRight />
          </Link>
          <Link
            href={`${url}page=${totalPages}`}
            className="flex items-center justify-center bg-zinc-800 lg:h-[2.5rem] lg:w-[2.5rem] h-[2rem] w-[2rem] rounded-full"
          >
            <HiMiniChevronDoubleRight />
          </Link>
        </>
      )}
    </div>
  );
};

export default Pagination;
