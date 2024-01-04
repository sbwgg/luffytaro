"use client";

import React, { useEffect, useState } from "react";

interface NextEpisodeTimeProp {
  nextAiringEpisode: {
    airingTime: number;
    timeUntilAiring: number;
    episode: number;
  };
}

const NextEpisodeTime = ({ nextAiringEpisode }: NextEpisodeTimeProp) => {
  const [timeUntilAiring, setTimeUntilAiring] = useState(
    nextAiringEpisode?.timeUntilAiring
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeUntilAiring((prevTimeRemaining) => prevTimeRemaining - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (timeInSeconds: number) => {
    const days = Math.floor(timeInSeconds / (24 * 3600));
    const hours = Math.floor((timeInSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const formattedTime = timeUntilAiring
    ? formatTime(timeUntilAiring)
    : "0d 0h 0m 0s";

  const date = new Date(nextAiringEpisode?.airingTime * 1000);

  return (
    <div>
      <p>Next episode: {nextAiringEpisode?.episode}</p>
      <p>
        Aired time: {date.toLocaleDateString([], { dateStyle: "full" })},{" "}
        {date.toLocaleTimeString([], { timeStyle: "short" })}
      </p>
      <p>Time remaining: {formattedTime}</p>
    </div>
  );
};

export default NextEpisodeTime;
