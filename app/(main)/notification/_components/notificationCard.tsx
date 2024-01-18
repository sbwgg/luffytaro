import React from "react";
import { NotificationType } from "./notificationsRow";
import Image from "next/image";
import Nami from "@/image/defaultprofile.jpg";
import { format } from "timeago.js";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { actionNotifRead } from "@/action/notification/actionNotifRead";
import { toast } from "sonner";

interface NotificationCardProp {
  notif: NotificationType;
  user: {
    id: string;
    username: string;
    email: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export default function NotificationCard({
  notif,
  user,
}: NotificationCardProp) {
  const queryClient = useQueryClient();

  const handleSelect = () => {
    queryClient.setQueryData<NotificationType[]>(
      ["notifications", user?.id],
      (old) =>
        old?.map((item) =>
          item.id === notif.id ? { ...item, select: !item.select } : item
        )
    );
  };

  const mutationMarkAsRead = useMutation({
    mutationFn: async () => {
      try {
        await actionNotifRead(notif.id);
      } catch (error) {
        console.log(error);
      }
    },
    onMutate: () => {
      queryClient.setQueryData<NotificationType[]>(
        ["notifications", user?.id],
        (old) =>
          old?.map((item) =>
            item.id === notif.id ? { ...item, markAllAsRead: true } : item
          )
      );
    },
  });

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 py-3 sm:px-5 px-3",
          !notif?.markAllAsRead ? "bg-zinc-900/80" : ""
        )}
        key={notif?.id}
      >
        <input
          type="checkbox"
          onChange={handleSelect}
          checked={notif?.select}
          className="accent-red-500 scale-[1.3]"
        />
        <Link
          onClick={() => mutationMarkAsRead.mutate()}
          className="flex items-center gap-3 flex-1"
          href={`${notif.url}&crId=${notif.commentId}`}
        >
          <Image
            src={notif?.notifSender?.profile || Nami}
            alt="profile"
            width={100}
            height={100}
            priority
            className="sm:w-[3rem] w-[2.5rem] sm:h-[3rem] h-[2.5rem] object-cover rounded-lg"
          />
          <div className="space-y-1">
            <p className="text-sm:text-base text-sm">
              {notif?.notifSender?.username} {notif?.notifMessage}
            </p>
            <p className="sm:text-sm text-xs text-zinc-400">
              {format(notif?.createdAt)}
            </p>
          </div>
        </Link>
      </div>
    </>
  );
}
