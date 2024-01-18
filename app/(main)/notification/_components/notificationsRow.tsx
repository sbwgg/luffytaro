"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import NotificationCard from "./notificationCard";
import { FaCheck } from "react-icons/fa";
import { actionDeleteSelected } from "@/action/notification/actiionDeleteSelected";
import { actionMarkAllAsRead } from "@/action/notification/actionMarkAllAsRead";
import { useSocket } from "@/lib/socketProvider";
import { toast } from "sonner";

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

export interface NotificationType {
  commentId: string;
  id: string;
  notifMessage: string;
  notifRecieverId: string;
  notifSenderId: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  markAllAsRead: boolean;
  select: boolean;
  notifSender: {
    profile: string;
    username: string;
  };
}

const NotificationsRow = ({ user }: NotificationsRowProp) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const {
    data: notification,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: user?.id !== undefined,
    queryFn: async () => {
      try {
        const res = await axios.get<NotificationType[]>(
          `${process.env.NEXT_PUBLIC_MAIN_URL}/api/notification?userId=${user?.id}`
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const isSelectAll = notification?.every((item) => item.select === true);

  const handleSelectAll = () => {
    if (!isSelectAll) {
      queryClient.setQueryData<NotificationType[]>(
        ["notifications", user?.id],
        (old) =>
          old?.map((item) =>
            item.select === false ? { ...item, select: true } : item
          )
      );
    } else {
      queryClient.setQueryData<NotificationType[]>(
        ["notifications", user?.id],
        (old) =>
          old?.map((item) =>
            item.select === true ? { ...item, select: false } : item
          )
      );
    }
  };

  const deleteSelectedNotif = notification?.filter(
    (item) => item.select === true
  );

  const mutationDeleteSelected = useMutation({
    mutationFn: async () => {
      try {
        for (const deleteSelectedNotifs of deleteSelectedNotif!) {
          await actionDeleteSelected(deleteSelectedNotifs.id);
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      toast("Success", {
        description: "Deleted Successfully",
      });
    },
    onMutate: () => {
      for (const deleteSelectedNotifs of deleteSelectedNotif!) {
        queryClient.setQueryData<NotificationType[]>(
          ["notifications", user?.id],
          (old) => old?.filter((item) => item.id !== deleteSelectedNotifs.id)
        );
      }
    },
  });

  const mutationMarkAllAsRead = useMutation({
    mutationFn: async () => {
      try {
        await actionMarkAllAsRead();
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      toast("Success", {
        description: "Mark all as read",
      });
    },
    onMutate: () => {
      queryClient.setQueryData<NotificationType[]>(
        ["notifications", user?.id],
        (old) =>
          old?.map((item) =>
            item.markAllAsRead === false
              ? ({ ...item, markAllAsRead: true } as NotificationType)
              : item
          )
      );
    },
  });

  useEffect(() => {
    socket.current?.on("getNotification", (data: NotificationType) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", user?.id],
        });
      }
    });
  }, [queryClient, user?.id, socket]);

  return (
    <>
      <div className="flex justify-between items-center mb-4 p-3 py-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={isSelectAll && notification?.length ? isSelectAll : false}
            className="scale-[1.3] accent-red-500"
          />
          <div className="text-zinc-400 sm:text-base text-sm">
            {deleteSelectedNotif?.length ? (
              <button
                disabled={mutationDeleteSelected.isPending}
                onClick={() => mutationDeleteSelected.mutate()}
                className="text-red-500"
              >
                Delete Selected ({deleteSelectedNotif.length})
              </button>
            ) : (
              "Select all"
            )}
          </div>
        </div>

        <div>
          <button
            onClick={() => mutationMarkAllAsRead.mutate()}
            className="flex items-center gap-2 text-zinc-400 sm:text-base text-sm"
          >
            <FaCheck /> Mark all as read
          </button>
        </div>
      </div>

      {isSuccess && (
        <>
          {!notification?.length ? (
            <div className="min-h-[30vh] flex items-center justify-center text-zinc-400">
              No notifications
            </div>
          ) : (
            <div>
              {notification?.map((notif) => (
                <NotificationCard key={notif.id} notif={notif} user={user} />
              ))}
            </div>
          )}
        </>
      )}

      {isLoading && (
        <div className="min-h-[30vh] flex items-center justify-center">
          Loading...
        </div>
      )}
    </>
  );
};

export default NotificationsRow;
