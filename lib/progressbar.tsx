"use client";

import React from "react";
import { Next13ProgressBar } from "next13-progressbar";

const ProgressbarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <Next13ProgressBar
        height="2px"
        color="red"
        options={{ showSpinner: false }}
        showOnShallow
      />
    </div>
  );
};

export default ProgressbarProvider;
