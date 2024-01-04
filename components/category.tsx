"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Category = () => {
  const pathname = usePathname();

  const category = [
    { name: "Most favorite", url: "most-favorite" },
    { name: "Most popular", url: "most-popular" },
    { name: "Subbed anime", url: "subbed-anime" },
    { name: "Dubbed anime", url: "dubbed-anime" },
    { name: "Recently updated", url: "recently-updated" },
    { name: "Recently added", url: "recently-added" },
    { name: "Top upcoming", url: "top-upcoming" },
    { name: "Top airing", url: "top-airing" },
    { name: "Movie", url: "movie" },
    { name: "Special", url: "special" },
    { name: "Ova", url: "ova" },
    { name: "Ona", url: "ona" },
    { name: "TV", url: "tv" },
    { name: "Completed", url: "completed" },
  ];

  return (
    <div className="mt-10">
      <h1 className="text-xl">
        <span className="p-1 mr-3 bg-red-500  rounded-lg" />
        Categories
      </h1>

      <div className="flex flex-wrap gap-2 mt-5">
        {category.map((cat) => (
          <Link
            key={cat.name}
            href={`/category/${cat.url}`}
            className={cn(
              "p-2 px-3 bg-zinc-900 rounded text-sm",
              pathname === `/category/${cat.url}` ? "bg-red-500" : ""
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
