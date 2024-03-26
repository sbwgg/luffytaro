import React, { useState } from "react";
import "./search.css";
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
  totalPages: number;
  hasNextPage: boolean;
  searchQuery: string;
  searchFilters: {
    [filter_name: string]: string[];
  };
}

const getSearchResult = async (
  keyw: string,
  page: string,
  filters: Record<string, string>
) => {
  const filterParams = new URLSearchParams(filters).toString();
  const res = await fetch(
    `${process.env.ANIWATCH_URL}/anime/search?q=${keyw}&page=${page || ""}&${filterParams}`,
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

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { keyw: string; page: string };
}) => {
  const { keyw, page } = searchParams;
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchResult, setSearchResult] = useState<SearchResultType>({
    animes: [],
    mostPopularAnimes: [],
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    searchQuery: "",
    searchFilters: {},
  });

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await getSearchResult(keyw, page, filters);
    setSearchResult(result);
  };

  return (
    <div className="pt-24">
      <form onSubmit={handleSubmit}>
        <div className="lg:flex gap-x-4 px-3 lg:px-10">
          <div className="flex-1">
            <h1 className="sm:text-xl">
              <span className="p-1 mr-3 bg-red-500 rounded-lg" />
              SEARCH RESULTS FOR <span className="uppercase">{keyw}</span>
            </h1>

            <div className="flex flex-wrap gap-4 mt-4">
              {/* Dropdown menus for advanced search options */}
              <div>
                <label htmlFor="type">Type:</label>
                <select
                  id="type"
                  name="type"
                  onChange={handleFilterChange}
                  value={filters.type || ""}
                >
                  <option value="">Any</option>
                  <option value="movie">Movie</option>
                  <option value="tv">TV</option>
                </select>
              </div>
              {/* Other dropdowns go here */}
              {/* Add more dropdowns for other filters */}
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Search
              </button>
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
      </form>
    </div>
  );
};

export default SearchPage;
