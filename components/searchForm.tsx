import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next13-progressbar";
import React, { FormEvent, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface SearchSuggestProp {
  suggestions: {
    id: string;
    jname: string;
    moreInfo: string[];
    name: string;
    poster: string;
  }[];
}

const SearchForm = () => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggest, setShowSuggest] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const {
    data: searchSuggest,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["search", inputValue],
    enabled: inputValue !== "",
    queryFn: async () => {
      try {
        const res = await axios.get<SearchSuggestProp>(
          `${process.env.NEXT_PUBLIC_ANIWATCH_URL}/anime/search/suggest?q=${inputValue}`
        );
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
  });

  useEffect(() => {
    function handleClick() {
      setShowSuggest(false);
    }

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    setShowInput(false);
  }, [pathname]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue) {
      router.push(`/search?keyw=${inputValue.replace(" ", "+")}`);
    }

    setInputValue("");
    setShowInput(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowInput(!showInput)}
        className="lg:hidden block"
      >
        {showInput ? <IoClose /> : <FaSearch />}
      </button>

      <div
        className={cn(
          "flex-1 lg:static fixed inset-x-3 lg:mt-0 mt-6",
          showInput ? "block" : "hidden lg:block"
        )}
      >
        <form onSubmit={handleSubmit} className="flex items-center">
          <button className="absolute left-3 text-black">
            <FaSearch />
          </button>
          <input
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              setShowSuggest(true);
            }}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggest(true);
            }}
            value={inputValue}
            className="p-2 text-sm text-zinc-500 outline-none rounded pl-10 lg:w-[18.5rem] flex-1"
            placeholder="Search anime..."
          />
        </form>

        <div className="flex flex-col absolute inset-x-0 bg-black/90">
          <div
            className={cn(
              "overflow-auto flex-1 duration-300",
              searchSuggest &&
                inputValue &&
                searchSuggest.suggestions.length > 1 &&
                isSuccess &&
                showSuggest
                ? "max-h-[29rem]"
                : "max-h-0"
            )}
          >
            {searchSuggest?.suggestions.map((s) => (
              <Link
                href={`/${s.id}`}
                onClick={() => setInputValue("")}
                key={s.id}
                className="flex items-center gap-3 p-3 border-b border-dashed border-zinc-800 group/item hover:bg-zinc-800 cursor-pointer"
              >
                <Image
                  src={s.poster}
                  alt="poster"
                  width={100}
                  height={100}
                  priority
                  className="w-[3rem] h-full object-cover shrink-0"
                />

                <div className="overflow-hidden space-y-1 pr-3">
                  <p className="truncate text-[15px] group-hover/item:text-red-500 text-sm">
                    {s.name}
                  </p>
                  <p className="text-[13px] text-zinc-400 truncate">
                    {s.jname}
                  </p>
                  <p className="flex gap-x-1 text-[13px] text-zinc-400">
                    <span>{s.moreInfo[0]}</span>
                    &#x2022;
                    <span className="text-white">{s.moreInfo[1]}</span>
                    &#x2022;
                    <span>{s.moreInfo[2]}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {searchSuggest &&
            inputValue &&
            searchSuggest.suggestions.length > 1 &&
            isSuccess &&
            showSuggest && (
              <Link
                onClick={() => setInputValue("")}
                href={`/search?keyw=${inputValue}`}
                className="bg-red-500 p-3 flex justify-center text-sm"
              >
                View all results
              </Link>
            )}
        </div>

        <div
          className={cn(
            "absolute inset-x-0 flex items-center justify-center bg-black duration-300",
            inputValue && isLoading && showSuggest ? "py-4" : "p-0"
          )}
        >
          {isLoading && inputValue ? <p>Loading...</p> : null}
        </div>

        <div
          className={cn(
            "absolute inset-x-0 flex items-center justify-center bg-black duration-300",
            isSuccess &&
              searchSuggest &&
              showSuggest &&
              searchSuggest?.suggestions.length < 1
              ? "py-4"
              : "p-0"
          )}
        >
          {isSuccess &&
          searchSuggest &&
          searchSuggest?.suggestions.length < 1 ? (
            <p>{showSuggest && "No results :("}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
