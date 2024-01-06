import React from "react";

export default function Notfound() {
  return (
    <div className="flex items-center justify-center min-h-[100dvh] text-white bg-black">
      <div className="flex flex-col items-center">
        <p className="text-2xl font-bold mb-3">Page not found</p>
        <p className="text-xl">404</p>
      </div>
    </div>
  );
}
