"use client";

import Image from "next/image";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import Nami from "@/image/defaultprofile.jpg";
import { Button } from "@/components/ui/button";
import { actionComment } from "@/action/comment/actionComment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BsEmojiSmileFill } from "react-icons/bs";
import CommentCard from "./commentCard";
import { useSocket } from "@/lib/socketProvider";
import { useOpenAuth } from "@/lib/zustand";
import EmojiPicker from "emoji-picker-react";
import { cn } from "@/lib/utils";

interface UserProp {
  user: {
    id: string;
    username: string;
    email: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

export interface ReplyCommentType {
  commentId: string;
  createdAt: Date;
  dislike: string[];
  id: string;
  like: string[];
  replyComment: string;
  replyTo: string | null;
  spoiler: boolean;
  isEdited: boolean;
  updatedAt: Date;
  user: {
    id: string;
    profile: string;
    username: string;
  };
  userId: string;
}

export interface CommentsType {
  comment: string;
  createdAt: Date;
  dislike: string[];
  id: string;
  like: string[];
  spoiler: boolean;
  isEdited: boolean;
  updatedAt: Date;
  user: {
    id: string;
    profile: string;
    username: string;
  };
  userId: string;
  replyComment: ReplyCommentType[];
}

const CommentRow = ({ user }: UserProp) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const setIsOpen = useOpenAuth((state) => state.setIsOpen);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [sort, setSort] = useState("Newest");

  const {
    data: comments,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      try {
        const res = await axios.get<CommentsType[]>(
          `${process.env.NEXT_PUBLIC_MAIN_URL}/api/comment`
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    socket.current?.on("getComment", (data: CommentsType) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    });

    socket.current?.on("getReplyComment", (data: ReplyCommentType) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    });

    socket.current?.on("getSaveEditedComment", (data: CommentsType) => {
      if (data) {
        queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
          old?.map((item) =>
            item.id === data.id
              ? { ...item, comment: data.comment, isEdited: true }
              : item
          )
        );
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    });

    socket.current?.on("getSaveEditedReplyComent", (data: ReplyCommentType) => {
      queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
        old?.map((item) =>
          item.id === data.commentId
            ? {
                ...item,
                replyComment: item.replyComment.map((item) =>
                  item.id === data.id
                    ? {
                        ...item,
                        replyComment: data.replyComment,
                        isEdited: true,
                      }
                    : item
                ),
              }
            : item
        )
      );
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    });

    socket.current?.on("getDeleteComment", (data: CommentsType) => {
      queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
        old?.filter((item) => item.id !== data.id)
      );
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    });

    socket.current?.on("getDeleteReplyComment", (data: ReplyCommentType) => {
      queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
        old?.map((item) =>
          item.id === data.commentId
            ? {
                ...item,
                replyComment: item.replyComment.filter(
                  (item) => item.id !== data.id
                ),
              }
            : item
        )
      );
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    });
  }, [queryClient, socket]);

  const mutateSendComment = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const data = await actionComment(formData, user?.id);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["comments"], (old) => [
          ...(old as CommentsType[]),
          data,
        ]);
        socket.current.emit("sendComment", data);
      }
    },
  });

  const handleComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) return setIsOpen();

    const formData = new FormData(e.currentTarget);
    mutateSendComment.mutate(formData);
    setShowEmoji(false);
    e.currentTarget.reset();
  };

  const handlePickEmoji = (value: any) => {
    const emoji = value.emoji;

    textareaRef.current?.focus();
    const start = textareaRef.current!.selectionStart;
    const textareaValue = textareaRef.current!.value;
    const first = textareaValue?.substring(0, start);
    const last = textareaValue?.substring(start);
    const newValue = first + emoji + last;
    textareaRef.current!.value = newValue;
    textareaRef.current?.focus();

    textareaRef.current!.selectionEnd = start + emoji.length;
  };

  const sortComments = (a: CommentsType, b: CommentsType) => {
    const dateA = new Date(a.createdAt) as any;
    const dateB = new Date(b.createdAt) as any;
    if (sort === "Newest") {
      return dateA - dateB;
    } else if (sort === "Oldest") {
      return dateB - dateA;
    } else if (sort === "Best") {
      return a.like.length - b.like.length;
    }

    return 1;
  };

  return (
    <>
      <h1 className="sm:text-xl cursor-pointer">
        <span className="p-1 mr-3 bg-red-500 rounded-lg" />
        Comments
      </h1>
      <div className="flex gap-x-3 mt-5">
        <Image
          src={user?.profile || Nami}
          alt="profile"
          width={100}
          height={100}
          className="sm:w-[3rem] w-[2.5rem] h-[2.5rem] sm:h-[3rem] rounded-lg border border-white/40"
          priority
        />
        <form onSubmit={handleComment} className="flex-1">
          <div className="relative">
            <textarea
              rows={2}
              name="comment"
              ref={textareaRef}
              required
              className="w-full p-2 sm:pr-12 text-black outline-none"
              placeholder="Join the discussion"
            />
            <button
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              className="absolute right-4 scale-125 top-3 text-zinc-400 sm:block hidden"
            >
              <BsEmojiSmileFill />
            </button>
            {showEmoji && (
              <div className="absolute left-0 z-[300]">
                <EmojiPicker width={280} onEmojiClick={handlePickEmoji} />
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex gap-x-2 text-sm items-start">
              <div className="flex items-center gap-1">
                <input
                  name="spoiler"
                  type="checkbox"
                  className="rounded-full"
                />
                <p>Spoiler?</p>
              </div>
            </div>
            <Button className="text-xs">Comment</Button>
          </div>
        </form>
      </div>

      {comments && comments?.length > 100 && (
        <div className="flex items-center gap-3 mt-7 mb-7 text-zinc-400 text-sm">
          <button
            onClick={() => setSort("Best")}
            className={cn(
              sort === "Best" && "text-white border-b-2 border-white"
            )}
          >
            Best
          </button>
          <button
            onClick={() => setSort("Newest")}
            className={cn(
              sort === "Newest" && "text-white border-b-2 border-white"
            )}
          >
            Newest
          </button>
          <button
            onClick={() => setSort("Oldest")}
            className={cn(
              sort === "Oldest" && "text-white border-b-2 border-white"
            )}
          >
            Oldest
          </button>
        </div>
      )}

      {isSuccess && comments && comments?.length >= 1 ? (
        <div className="mt-5">
          {comments
            .sort((a, b) => sortComments(a, b))
            ?.map((c) => (
              <CommentCard key={c.id} comment={c} user={user} socket={socket} />
            ))
            .reverse()}
        </div>
      ) : null}
      {isSuccess && comments && comments.length < 1 ? (
        <div className="min-h-[30dvh] flex items-center justify-center text-zinc-400">
          No comments
        </div>
      ) : null}
      {isLoading && (
        <div className="min-h-[30dvh] flex items-center justify-center text-zinc-400">
          Loading...
        </div>
      )}
    </>
  );
};

export default CommentRow;
