"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

interface CharactersVoiceActorsProp {
  characters: {
    id: number;
    role: string;
    name: {
      first: string;
      role: string;
      full: string;
      native: string;
      userPreffered: string;
    };
    image: string;
    voiceActors: {
      id: number;
      language: string;
      name: {
        first: string;
        last: string;
        full: string;
        native: string;
        userPreffered: string;
      };
      image: string;
    }[];
  }[];
}

const CharactersVoiceActors = ({ characters }: CharactersVoiceActorsProp) => {
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (showMore) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showMore]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/70 z-[800] flex justify-center overflow-auto duration-200 transition-all ease-in-out",
          showMore ? "opacity-1 visible" : "opacity-0 invisible"
        )}
      >
        <div className="flex-1 max-w-[40rem] mx-3 mt-12 mb-12">
          <div className="relative bg-zinc-900 py-10 px-3 sm:p-10 rounded-2xl">
            <button
              onClick={() => setShowMore(false)}
              className="absolute right-4 top-4"
            >
              <IoClose className="scale-[1.3]" />
            </button>

            <h1 className="sm:text-xl">
              <span className="p-1 mr-3 bg-red-500 rounded-lg" />
              CHARACTERS & VOICE ACTORS
            </h1>

            <div className="flex flex-col gap-3 mt-5">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="flex flex-col justify-center border-b border-dashed border-zinc-700 pb-8  bg-zinc-900 rounded-md"
                >
                  <div>
                    <p className="mb-3 italic">Character</p>
                    <div className="flex items-center gap-x-3 flex-1 mb-5">
                      <Image
                        src={character.image}
                        alt="character"
                        width={100}
                        height={100}
                        priority
                        className="w-[3rem] h-[3rem] object-cover rounded-full shrink-0"
                      />
                      <div className="space-y-2">
                        <p className="italic text-[13px]">
                          {character.name.full}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {character.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 italic">Voice actors</p>
                    <div className="grid grid-cols-2 gap-3">
                      {character.voiceActors.map((cv) => (
                        <div className="flex items-center gap-3" key={cv.id}>
                          <Image
                            src={cv.image}
                            alt="character"
                            width={100}
                            height={100}
                            priority
                            className="w-[3rem] h-[3rem] object-cover rounded-full shrink-0"
                          />
                          <div className="space-y-2">
                            <p className="italic text-[13px]">{cv.name.full}</p>
                            <p className="text-xs text-zinc-400">
                              {cv.language}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1
          onClick={() => setShowMore(!showMore)}
          className="sm:text-xl cursor-pointer"
        >
          <span className="p-1 mr-3 bg-red-500 rounded-lg" />
          CHARACTERS & VOICE ACTORS &#62;
        </h1>

        <div className="characterVoiceActor gap-1 mt-5">
          {characters.slice(0, 8).map((character) => (
            <div
              key={character.id}
              className="flex gap-x-2 items-center p-3 bg-zinc-900 h-[5rem] rounded-md"
            >
              <div className="flex items-center gap-x-3 flex-1">
                <Image
                  src={character.image}
                  alt="character"
                  width={100}
                  height={100}
                  priority
                  className="w-[3rem] h-[3rem] object-cover rounded-full shrink-0"
                />
                <div className="space-y-2">
                  <p className="italic text-[13px]">{character.name.full}</p>
                  <p className="text-xs text-zinc-400">{character.role}</p>
                </div>
              </div>

              <div className="flex items-center flex-row-reverse gap-x-3 flex-1">
                <Image
                  src={character?.voiceActors[0]?.image}
                  alt="character"
                  width={100}
                  height={100}
                  priority
                  className="w-[3rem] h-[3rem] object-cover rounded-full shrink-0"
                />
                <div className="space-y-2">
                  <p className="italic text-[13px] text-end">
                    {character?.voiceActors[0]?.name.full}
                  </p>
                  <p className="text-end text-zinc-400 text-xs">
                    {character?.voiceActors[0]?.language}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CharactersVoiceActors;
