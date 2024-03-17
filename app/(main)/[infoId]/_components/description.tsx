"use client";

import { cn } from "@/lib/utils";
import React, { ElementRef, useEffect, useRef, useState } from "react";

const Description = ({ description }: { description: string }) => {
  const [seemore, setSeemore] = useState(false);
  const [show, setShow] = useState(false);
  const ref = useRef<ElementRef<"p">>(null);

  useEffect(() => {
    if (ref.current) {
      setShow(ref.current.scrollHeight !== ref.current.clientHeight);
    }
  }, []);

  return (
    <>
      <div className="space-y-1 text-zinc-400">
        <p className={cn(seemore ? "" : "line-clamp-4")} ref={ref}>
          {description}
        </p>
        {show && (
          <button
            onClick={() => setSeemore(!seemore)}
            className="flex border border-zinc-900 bg-zinc-500/30 text-xs p-1 font-semibold cursor-pointer"
          >
            {seemore ? " see less-" : " see more+"}
          </button>
        )}
      </div>
    </>
  );
};

export default Description;
