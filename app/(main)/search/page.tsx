'use client';

import React, { useState } from "react";
import GridCardAnime from "@/components/gridCardAnime";
import MostPopularAnime from "@/components/mostPopularAnime";
import Pagination from "@/components/pagination";
import "./search.css";

export interface SearchResultType {
  animes: {
    id: string;
    name: string;
    poster: string;
    duration: string;
    type: string;
    rating: string;
    episodes: {
      sub: number;
      dub: number | null;
    };
  }[];
  mostPopularAnimes: {
    id: string;
    name: string;
    jname: string;
    poster: string;
    episodes: {
      sub: number;
      dub: number;
    };
    type: string;
  }[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

const getSearchResult = async (keyw: string, page: string, filters: { type?: string; rating?: string }) => {
  const filterParams = new URLSearchParams(filters).toString();
  const res = await fetch(
    `${process.env.ANIWATCH_URL}/search?q=${keyw}&page=${page || ""}&${filterParams}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const SearchPage = async ({ searchParams }: { searchParams: { keyw: string; page: string } }) => {
  const { keyw, page } = searchParams;
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [selectedRating, setSelectedRating] = useState<string | undefined>(undefined);
  
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRating(event.target.value);
  };

  const searchResult: SearchResultType = await getSearchResult(keyw, page, { type: selectedType, rating: selectedRating });

  return (
    <div className="pt-24">
      <div className="lg:flex gap-x-4 px-3 lg:px-10">
        <div className="flex-1">
          <h1 className="sm:text-xl">
            <span className="p-1 mr-3 bg-red-500 rounded-lg" />
            SEARCH RESULTS FOR <span className="uppercase">{keyw}</span>
          </h1>

          <div className="flex gap-x-4 mt-5">
            <label htmlFor="type">Type:</label>
            <select id="type" value={selectedType || ""} onChange={handleTypeChange}>
              <option value="">All</option>
              <option value="TV">TV</option>
              <option value="Movie">Movie</option>
              <option value="OVA">OVA</option>
              {/* Add more options as needed */}
            </select>

            <label htmlFor="rating">Rating:</label>
            <select id="rating" value={selectedRating || ""} onChange={handleRatingChange}>
              <option value="">All</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              {/* Add more options as needed */}
            </select>
          </div>

          {!searchResult.animes.length ? (
            <div className="flex items-center justify-center text-gray-300 min-h-[80dvh]">
              No results
            </div>
          ) : (
            <div className="gridCard gap-x-2 gap-y-8 mt-5">
              {searchResult.animes.map((anime) => (
                <GridCardAnime key={anime.id} anime={anime} />
              ))}
            </div>
          )}

          {searchResult.totalPages > 1 && (
            <div className="flex items-center justify-center mt-12">
              <Pagination
                page={parseInt(page) || 1}
                url={`/search?keyw=${keyw.replace(" ", "+")}&`}
                totalPages={searchResult.totalPages}
              />
            </div>
          )}
        </div>

        <div className="basis-[19.5rem] mt-10 lg:mt-0">
          <h1 className="sm:text-xl">
            <span className="p-1 mr-3 bg-red-500 rounded-lg" />
            MOST POPULAR
          </h1>

          <div className="mt-5 bg-zinc-900 px-4 py-2">
            {searchResult.mostPopularAnimes.map((mostPopular, i) => (
              <MostPopularAnime
                key={mostPopular.id}
                mostPopular={mostPopular}
                index={i}
                length={searchResult.mostPopularAnimes.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;