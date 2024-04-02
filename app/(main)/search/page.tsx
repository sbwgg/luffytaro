
import GridCardAnime from "@/components/gridCardAnime";
import "./search.css";
import MostPopularAnime from "@/components/mostPopularAnime";
import Pagination from "@/components/pagination";
import React, { useState, useEffect } from 'react';

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

const getSearchResult = async (keyw: string, page: string, language: string) => {
  const res = await fetch(
    `${process.env.ANIWATCH_URL}/anime/search?q=${keyw}&page=${page || ""}&language=${language}`,
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

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: { keyw: string };
}) => {
  const { keyw } = searchParams;

  return {
    title: `Search Results For ${keyw.charAt(0).toUpperCase() + keyw.slice(1)}`,
  };
};

const SearchPage: React.FC<{ searchParams: { keyw: string; page: string; language: string } }> = ({ searchParams }) => {
  const { keyw, page, language } = searchParams;
  const [searchResult, setSearchResult] = useState<SearchResultType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearchResult(keyw, page, language);
        setSearchResult(result);
      } catch (error) {
        console.error('Error fetching search result:', error);
      }
    };

    fetchData();
  }, [keyw, page, language]);

  return (
    <div className="pt-24">
      <div className="lg:flex gap-x-4 px-3 lg:px-10">
        <div className="flex-1">
          <h1 className="sm:text-xl">
            <span className="p-1 mr-3 bg-red-500 rounded-lg" />
            SEARCH RESULTS FOR <span className="uppercase">{keyw}</span>
          </h1>

          {!searchResult?.animes.length ? (
            <div className="flex items-center justify-center text-gray-300 min-h-[80dvh]">
              No results
            </div>
          ) : (
            <div className="gridCard gap-x-2 gap-y-8 mt-5">
              {searchResult?.animes.map((anime) => (
                <GridCardAnime key={anime.id} anime={anime} />
              ))}
            </div>
          )}

          {searchResult?.totalPages && searchResult.totalPages > 1 && (
            <div className="flex items-center justify-center mt-12">
              <Pagination
                page={parseInt(page) || 1}
                url={`/search?keyw=${keyw.replace(" ", "+")}&language=${language}&`}
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
            {searchResult?.mostPopularAnimes.map((mostPopular, i) => (
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