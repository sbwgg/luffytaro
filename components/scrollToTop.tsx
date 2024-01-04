"use client";

import React, { useEffect, useState } from "react";
import { BiSolidChevronUp } from "react-icons/bi";

const ScrollToTop = () => {
  const [showbutton, setShowbutton] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 200) {
        document.documentElement.style.scrollBehavior = "smooth";
        setShowbutton(true);
      } else {
        document.documentElement.style.scrollBehavior = "";
        setShowbutton(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {showbutton && (
        <div className="fixed bottom-4 right-4 z-[30]">
          <button
            onClick={() => window.scrollTo(0, 0)}
            className="rounded-full p-3 bg-zinc-800"
          >
            <BiSolidChevronUp />
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
