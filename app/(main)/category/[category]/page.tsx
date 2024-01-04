import CategoryCard from "@/components/categoryCard";
import React from "react";
import "./category.css";
import Top10Anime from "../../(route)/_components/top10Anime";
import Pagination from "@/components/pagination";
import Category from "@/components/category";

interface CategoryAnimeType {
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
  top10Animes: {
    today: {
      id: string;
      rank: number;
      name: string;
      poster: string;
      episodes: {
        sub: number;
        dub: number;
      };
    }[];
    week: {
      id: string;
      rank: number;
      name: string;
      poster: string;
      episodes: {
        sub: number;
        dub: number;
      };
    }[];
    month: {
      id: string;
      rank: number;
      name: string;
      poster: string;
      episodes: {
        sub: number;
        dub: number;
      };
    }[];
  };
  category: string;
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

const getCategoryAnime = async (category: string, page: string) => {
  const res = await fetch(
    `${process.env.ANIWATCH_URL}/anime/${category}?page=${page}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch category anime");
  }
  return res.json();
};

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { page: string };
}) => {
  const { category } = params;
  const { page } = searchParams;
  const categoryAnime: CategoryAnimeType = await getCategoryAnime(
    category,
    page
  );

  return {
    title: `Watch ${categoryAnime.category} Anime on LuffyTaro for free`,
  };
};

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { page: string };
}) => {
  const { category } = params;
  const { page } = searchParams;
  const categoryAnime: CategoryAnimeType = await getCategoryAnime(
    category,
    page
  );

  return (
    <div className="pt-24">
      <div className="lg:flex gap-x-4 px-3 lg:px-10">
        <div className="flex-1">
          <h1 className="text-xl">
            <span className="p-1 mr-3 bg-red-500 rounded-lg" />
            {categoryAnime.category}
          </h1>

          <div className="gridCard gap-x-2 gap-y-8 mt-5">
            {categoryAnime.animes.map((cat) => (
              <CategoryCard anime={cat} key={cat.id} />
            ))}
          </div>

          {categoryAnime.totalPages > 1 && (
            <div className="flex items-center justify-center mt-12">
              <Pagination
                page={parseInt(page) || 1}
                url={`/category/${category}?`}
                totalPages={categoryAnime.totalPages}
              />
            </div>
          )}
        </div>

        <div className="lg:w-[19.5rem]">
          <Top10Anime top10anime={categoryAnime.top10Animes} />
          <Category />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
