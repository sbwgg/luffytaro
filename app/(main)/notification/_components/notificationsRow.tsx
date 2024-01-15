"use client";

import React from "react";

interface NotificationsRowProp {
  user: {
    id: string;
    username: string;
    email: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

const NotificationsRow = ({ user }: NotificationsRowProp) => {
  return (
    <>
      <div className="flex justify-between items-center mb-7 border border-zinc-800 p-3 py-4">
        <div className="flex items-center gap-3">
          <input type="checkbox" className="scale-[1.3] accent-red-500" />
          <p className="text-zinc-400">Select all</p>
        </div>

        <div>
          <button className="text-zinc-400">Mark all as read</button>
        </div>
      </div>

      <div></div>
    </>
  );
};

export default NotificationsRow;
