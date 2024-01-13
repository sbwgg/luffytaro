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
          className="w-[3rem] h-[3rem] rounded-lg border border-white/40"
          priority
        />
        <form onSubmit={handleComment} className="flex-1">
          <div className="relative">
            <textarea
              rows={2}
              name="comment"
              ref={textareaRef}
              required
              className="w-full p-2 pr-12 text-black outline-none"
              placeholder="Join the discussion"
            />
            <button
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              className="absolute right-4 scale-125 top-3 text-zinc-400"
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
            <Button>Comment</Button>
          </div>
        </form>
      </div>

      {isSuccess && comments && comments?.length >= 1 ? (
        <div className="mt-5">
          {comments
            ?.map((c) => (
              <CommentCard key={c.id} comment={c} user={user} socket={socket} />
            ))
            .reverse()}
        </div>
      ) : (
        <div className="min-h-[30dvh] flex items-center justify-center text-zinc-400">
          No comments
        </div>
      )}

      {isLoading && (
        <div className="min-h-[30dvh] flex items-center justify-center text-zinc-400">
          Loading...
        </div>
      )}
    </>
  );
};

export default CommentRow;
