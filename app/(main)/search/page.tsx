"use client";

import React, { useState, useEffect } from "react";
import GridCardAnime from "@/components/gridCardAnime";
import MostPopularAnime from "@/components/mostPopularAnime";
import Pagination from "@/components/pagination";

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

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { keyw: string; page: string };
}) => {
  const { keyw, page } = searchParams;
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [rated, setRated] = useState("");
  const [score, setScore] = useState("");
  const [season, setSeason] = useState("");
  const [language, setLanguage] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  const [searchResult, setSearchResult] = useState<SearchResultType>({
    animes: [],
    mostPopularAnimes: [],
    currentPage: 1,
    hasNextPage: false,
    totalPages: 1,
  });

  useEffect(() => {
    const getSearchResult = async () => {
      const res = await fetch(
        `${process.env.ANIWATCH_URL}/anime/search?q=${keyw}&page=${page || ""}&type=${type}&status=${status}&rated=${rated}&score=${score}&season=${season}&language=${language}&start_date=${start_date}&end_date=${end_date}`,
        {
          next: {
            revalidate: 60,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setSearchResult(data);
    };

    getSearchResult();
  }, [keyw, page, type, status, rated, score, season, language, start_date, end_date]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleRatedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRated(event.target.value);
  };

  const handleScoreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setScore(event.target.value);
  };

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSeason(event.target.value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  return (
    <div className="pt-24">
      <div className="lg:flex gap-x-4 px-3 lg:px-10">
        <div className="flex-1">
          <select value={type} onChange={handleTypeChange}>
            <option value="">Select Type</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
          <select value={status} onChange={handleStatusChange}>
            <option value="">Select Status</option>
            <option value="finished-airing">Finished Airing</option>
            <option value="currently-airing">Currently Airing</option>
          </select>
          {/* Implement other dropdown menus for filters */}

          <h1 className="sm:text-xl">
            <span className="p-1 mr-3 bg-red-500 rounded-lg" />
            SEARCH RESULTS FOR <span className="uppercase">{keyw}</span>
          </h1>

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