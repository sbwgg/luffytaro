'use client';

import React, { useState, useEffect } from "react";
import GridCardAnime from "@/components/gridCardAnime";
import MostPopularAnime from "@/components/mostPopularAnime";
import Pagination from "@/components/pagination";
import "./search.css";

interface Anime {
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
}

interface MostPopularAnime {
  id: string;
  name: string;
  jname: string;
  poster: string;
  episodes: {
    sub: number;
    dub: number;
  };
  type: string;
}

interface SearchResultType {
  animes: Anime[];
  mostPopularAnimes: MostPopularAnime[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

const getSearchResult = async (keyw: string, page: string, filters: { type?: string; rating?: string }) => {
  const filterParams = new URLSearchParams();

  // Add type parameter if it exists
  if (filters.type) {
    filterParams.append('type', filters.type);
  }

  // Add rating parameter if it exists
  if (filters.rating) {
    filterParams.append('rating', filters.rating);
  }

  const res = await fetch(
    `${process.env.ANIWATCH_URL}/anime/search?q=${keyw}&page=${page || "1"}${filterParams.toString()}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json() as Promise<SearchResultType>;
};

const SearchPage: React.FC<{ searchParams: { keyw: string; page: string } }> = ({ searchParams }) => {
  const { keyw, page } = searchParams;
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [selectedRating, setSelectedRating] = useState<string | undefined>(undefined);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRating(event.target.value);
  };

  const pageNumber = page || "1";
  const typeFilter = selectedType !== undefined ? selectedType : "";
  const ratingFilter = selectedRating !== undefined ? selectedRating : "";

  const [searchResult, setSearchResult] = useState<SearchResultType>({
    animes: [],
    mostPopularAnimes: [],
    currentPage: 1,
    hasNextPage: false,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchSearchResult = async () => {
      try {
        const result = await getSearchResult(keyw, pageNumber, { type: typeFilter, rating: ratingFilter });
        setSearchResult(result);
      } catch (error) {
        console.error("Error fetching search result:", error);
      }
    };
    fetchSearchResult();
  }, [keyw, pageNumber, typeFilter, ratingFilter]);

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
                page={parseInt(pageNumber) || 1}
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