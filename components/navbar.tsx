"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useTransition } from "react";
import LuffyTaro from "@/image/wp11567850.webp";
import { usePathname, useRouter } from "next/navigation";
import SearchForm from "./searchForm";
import { useOpenAuth } from "@/lib/zustand";
import defaultProfile from "@/image/defaultprofile.jpg";
import actionLogout from "@/action/auth/actionLogout";
import { FaBell, FaHeart, FaUser } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useSocket } from "@/lib/socketProvider";

interface NavbarProp {
  user: {
    id: string;
    username: string;
    email: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export default function Navbar({ user }: NavbarProp) {
  const [activeNav, setActiveNav] = useState(false);
  const { socket } = useSocket();
  const pathname = usePathname();
  const router = useRouter();
  const setIsOpen = useOpenAuth((state) => state.setIsOpen);
  const [pending, setTransition] = useTransition();
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 70 ? setActiveNav(true) : setActiveNav(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setShowProfileSettings(false);
  }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 flex items-center justify-between z-[500] duration-200 transition-all ease-in-out px-3 lg:px-10 p-2",
        activeNav && pathname === "/" ? "bg-black/50 backdrop-blur-[6px]" : "",
        pathname !== "/" && "bg-black/50 backdrop-blur-[5px]"
      )}
    >
      <div className="flex items-center gap-x-5">
        <div className="flex items-center gap-x-3">
          <Image
            src={LuffyTaro}
            alt="image"
            width={100}
            height={100}
            className="w-[2.4rem] h-[2.4rem] md:w-[2.9rem] md:h-[2.9rem] rounded-full"
            priority
          />
          <Link href="/" className="text-sm md:text-xl font-medium">
            LUFFYTARO
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-x-5 text-sm font-light">
          <Link
            href="/"
            className={cn(pathname === "/" ? "text-red-500 font-semibold" : "")}
          >
            Home
          </Link>
          <Link
            href="/category/completed"
            className={cn(
              pathname === "/category/completed"
                ? "text-red-500 font-semibold"
                : ""
            )}
          >
            Latest completed
          </Link>
          <Link
            href="/category/most-favorite"
            className={cn(
              pathname === "/category/most-favorite"
                ? "text-red-500 font-semibold"
                : ""
            )}
          >
            Most favorite
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-x-5">
        <SearchForm />
        {user?.id ? (
          <div className="flex items-center justify-center relative">
            <Image
              onClick={() => setShowProfileSettings(!showProfileSettings)}
              src={user.profile || defaultProfile}
              alt="profile"
              className="w-[2.5rem] h-[2.5rem] rounded-full cursor-pointer border border-white/20"
              priority
              width={300}
              height={100}
            />

            {showProfileSettings && (
              <div
                onClick={() => setShowProfileSettings(false)}
                className="flex flex-col absolute right-0 top-[3.5rem] bg-zinc-900/80 backdrop-blur-sm w-[16rem] rounded-lg p-4"
              >
                <div className="mb-4">
                  <p className="text-sm">{user.username}</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-x-2 bg-zinc-700 hover:bg-zinc-800 duration-200 rounded-full p-2 px-4 mb-[6px] text-sm"
                >
                  <FaUser />
                  Profile
                </Link>
                <Link
                  href="/continue-watching"
                  className="flex items-center gap-x-2 bg-zinc-700 hover:bg-zinc-800 duration-200 rounded-full p-2 px-4 mb-[6px] text-sm"
                >
                  <FaClockRotateLeft />
                  Continue watching
                </Link>
                <Link
                  href="/watch-list"
                  className="flex items-center gap-x-2 mb-[6px] rounded-full p-2 px-4 bg-zinc-700 hover:bg-zinc-800 duration-200 text-sm"
                >
                  <FaHeart />
                  Watch list
                </Link>
                <Link
                  href="/notification"
                  className="flex items-center gap-x-2 mb-[6px] rounded-full p-2 px-4 bg-zinc-700 hover:bg-zinc-800 duration-200 text-sm"
                >
                  <FaBell />
                  Notification
                </Link>
                <div>
                  <button
                    disabled={pending}
                    onClick={async () => {
                      setTransition(() => actionLogout());
                      socket.current.emit("sendLogout", user.id);
                      router.refresh();
                    }}
                    className="flex items-center gap-x-2 rounded-full p-2 px-4 bg-zinc-700 hover:bg-zinc-800 duration-200 w-full text-sm"
                  >
                    <FiLogOut />
                    {pending ? "Loading..." : "Log out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => setIsOpen()} className="text-sm md:text-base">
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
