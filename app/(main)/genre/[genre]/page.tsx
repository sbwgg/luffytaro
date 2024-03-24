import CategoryCard from "@/components/categoryCard";
import Pagination from "@/components/pagination";
import React from "react";
import "./genre.css";
import MostPopularAnime from "@/components/mostPopularAnime";

interface AnimeGenreType {
  genreName: string;
  animes: {
    id: string;
    name: string;
    poster: string;
    duration: string;
    type: string;
    rating: string;
    episodes: {
      sub: number;
      dub: number;
    };
  }[];
  genres: string[];
  topAiringAnimes: {
    id: string;
    name: string;
    poster: string;
    jname: string;
    episodes: {
      sub: number;
      dub: number;
    };
    type: string;
  }[];
  totalPages: number;
  hasNextPage: boolean;
  currentPage: number;
}

const getAnimeGenre = async (genre: string, page: string) => {
  const res = await fetch(
    `${process.env.ANIWATCH_URL}/anime/genre/${genre}?page=${page}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch anime genre");
  }
  return res.json();
};

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: { genre: string };
  searchParams: { page: string };
}) => {
  const { genre } = params;
  const { page } = searchParams;
  const animeGenre: AnimeGenreType = await getAnimeGenre(genre, page);

  return {
    title: `Watch ${animeGenre.genreName} on bertoo.pro for free`,
  };
};

const GenrePage = async ({
  params,
  searchParams,
}: {
  params: { genre: string };
  searchParams: { page: string };
}) => {
  const { genre } = params;
  const { page } = searchParams;
  const animeGenre: AnimeGenreType = await getAnimeGenre(genre, page);

  return (
    <div className="pt-24">
      <div className="lg:flex gap-x-4 px-3 lg:px-10">
        <div className="flex-1">
          <h1 className="text-xl">
            <span className="p-1 mr-3 bg-red-500 rounded-lg" />
            {animeGenre.genreName}
          </h1>

          <div className="gridCard gap-x-2 gap-y-8 mt-5">
            {animeGenre.animes.map((cat, index) => (
              <CategoryCard anime={cat} key={cat.id} />
            ))}
          </div>

          {animeGenre.totalPages > 1 && (
            <div className="flex items-center justify-center mt-12">
              <Pagination
                page={parseInt(page) || 1}
                url={`/genre/${genre}?`}
                totalPages={animeGenre.totalPages}
              />
            </div>
          )}
        </div>

        <div className="lg:w-[19.5rem] mt-10 lg:mt-0">
          <h1 className="text-xl">
            <span className="p-1 mr-3 bg-red-500 rounded-lg" />
            Most popular
          </h1>

          <div className="mt-5 bg-zinc-900 px-4 py-2 rounded-xl">
            {animeGenre.topAiringAnimes.map((mostPopular, i) => (
              <MostPopularAnime
                key={mostPopular.id}
                mostPopular={mostPopular}
                index={i}
                length={animeGenre.topAiringAnimes.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenrePage;
