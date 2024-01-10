"use client";

import React, { useState } from "react";

const Description = ({ description }: { description: string }) => {
  const [seemore, setSeemore] = useState<number | undefined>(350);

  return (
    <>
      <p className="text-zinc-400">
        {description.slice(0, seemore) +
          `${description.slice(0, seemore).length > 350 ? "" : "..."}`}
        {description.length > 350 && (
          <span
            onClick={() => setSeemore((prev) => (!prev ? 350 : undefined))}
            className="font-semibold cursor-pointer"
          >
            {seemore === undefined ? " see less-" : " see more+"}
          </span>
        )}
      </p>
    </>
  );
};

export default Description;
