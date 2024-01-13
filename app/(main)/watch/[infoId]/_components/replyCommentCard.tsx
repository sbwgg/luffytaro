import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { FormEvent, useRef, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { BsEmojiSmileFill } from "react-icons/bs";
import { format } from "timeago.js";
import Nami from "@/image/defaultprofile.jpg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actionLikeReplyComment } from "@/action/replyComment/actionLikeReplyComment";
import { CommentsType } from "./commentRow";
import { actionDislikeReplyComment } from "@/action/replyComment/actionDislikeReplyComment";
import { actionReplyComment } from "@/action/replyComment/actionReplyComment";
import { useOpenAuth } from "@/lib/zustand";
import EmojiPicker from "emoji-picker-react";
import { formatNumber } from "@/utils/formatNumber";

interface ReplyCommentCardProp {
  replyComment: {
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
  };
  user: {
    id: string;
    username: string;
    email: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  commentId: string;
  socket: any;
}

const ReplyCommentCard = ({
  replyComment,
  user,
  commentId,
  socket,
}: ReplyCommentCardProp) => {
  const [showInput, setShowInput] = useState(false);
  const queryClient = useQueryClient();
  const setIsOpen = useOpenAuth((state) => state.setIsOpen);
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mutationLikeReplyComment = useMutation({
    mutationFn: async () => {
      try {
        await actionLikeReplyComment(replyComment.id, user?.id);
      } catch (e) {
        console.log(e);
      }
    },
    onMutate: () => {
      const isLiked = replyComment.like.includes(user?.id as string);
      if (isLiked) {
        queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
          old?.map((item) =>
            item.id === commentId
              ? ({
                  ...item,
                  replyComment: item.replyComment.map((item) =>
                    item.id === replyComment.id
                      ? {
                          ...item,
                          like: item.like.filter((item) => item !== user?.id),
                        }
                      : item
                  ),
                } as CommentsType)
              : item
          )
        );
      } else {
        queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
          old?.map((item) =>
            item.id === commentId
              ? ({
                  ...item,
                  replyComment: item.replyComment.map((item) =>
                    item.id === replyComment.id
                      ? {
                          ...item,
                          like: [...item.like, user?.id],
                          dislike: item.dislike.filter(
                            (item) => item !== user?.id
                          ),
                        }
                      : item
                  ),
                } as CommentsType)
              : item
          )
        );
      }
    },
  });

  const mutationDislikeReplyComment = useMutation({
    mutationFn: async () => {
      try {
        await actionDislikeReplyComment(replyComment.id, user?.id);
      } catch (error) {
        console.log(error);
      }
    },
    onMutate: () => {
      const isDisliked = replyComment.dislike.includes(user?.id as string);
      if (isDisliked) {
        queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
          old?.map((item) =>
            item.id === commentId
              ? ({
                  ...item,
                  replyComment: item.replyComment.map((item) =>
                    item.id === replyComment.id
                      ? {
                          ...item,
                          dislike: item.dislike.filter((id) => id !== user?.id),
                        }
                      : item
                  ),
                } as CommentsType)
              : item
          )
        );
      } else {
        queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
          old?.map((item) =>
            item.id === commentId
              ? ({
                  ...item,
                  replyComment: item.replyComment.map((item) =>
                    item.id === replyComment.id
                      ? {
                          ...item,
                          dislike: [...item.dislike, user?.id],
                          like: item.like.filter((id) => id !== user?.id),
                        }
                      : item
                  ),
                } as CommentsType)
              : item
          )
        );
      }
    },
  });

  const handleLikeReplyComment = () => {
    if (!user?.id) return setIsOpen();

    mutationLikeReplyComment.mutate();
  };

  const handleDislikeReplyComment = () => {
    if (!user?.id) return setIsOpen();
    mutationDislikeReplyComment.mutate();
  };

  const mutationReplyComment = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const data = await actionReplyComment(
          formData,
          commentId,
          user?.id,
          user?.username
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
          old?.map((item) =>
            item.id === data.commentId
              ? ({
                  ...item,
                  replyComment: [...item.replyComment, data],
                } as CommentsType)
              : item
          )
        );
        socket.current.emit("sendReplyComment", data);
        setShowInput(false);
      }
    },
  });

  const handleReplyComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) return setIsOpen();

    const formData = new FormData(e.currentTarget);
    mutationReplyComment.mutate(formData);
    setShowEmoji(false);
    e.currentTarget.reset();
  };

  const handlePickEmoji = (value: any) => {
    const emoji = value.emoji;

    textareaRef.current!.focus();
    const start = textareaRef.current!.selectionStart;
    const currentValue = textareaRef.current!.value;
    const first = currentValue.substring(0, start);
    const last = currentValue.substring(start);
    const newValue = first + emoji + last;
    textareaRef.current!.value = newValue;
    textareaRef.current!.focus();

    textareaRef.current!.selectionEnd = start + emoji.length;
  };

  return (
    <div className="flex gap-3 mb-5">
      <Image
        src={replyComment.user.profile || Nami}
        alt="profile"
        width={100}
        height={100}
        className="w-[3rem] h-[3rem] rounded-lg border border-white/40"
        priority
      />
      <div className="flex-1">
        <p>{replyComment.user.username}</p>
        <p className="text-xs text-zinc-400 mb-2">
          {format(replyComment.createdAt)}
        </p>
        <div>
          <p
            className={cn(
              "relative break-words break-all whitespace-pre-wrap",
              replyComment.spoiler && "blur-[3px]"
            )}
          >
            {replyComment.replyTo ? (
              <span className="text-sm text-green-400">
                @{replyComment.replyTo}
              </span>
            ) : null}{" "}
            {replyComment.replyComment}
          </p>
          {replyComment.spoiler && (
            <button
              onClick={() =>
                queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
                  old?.map((item) =>
                    item.id === commentId
                      ? ({
                          ...item,
                          replyComment: item.replyComment.map((item) =>
                            item.id === replyComment.id
                              ? { ...item, spoiler: false }
                              : item
                          ),
                        } as CommentsType)
                      : item
                  )
                )
              }
              className="bg-white text-black text-xs p-1 mt-2"
            >
              Show spoiler
            </button>
          )}
        </div>
        <div className="flex items-center gap-5 mt-2 text-zinc-400 text-sm">
          <button
            onClick={handleLikeReplyComment}
            className={cn(
              "flex items-center gap-2",
              replyComment.like.includes(user?.id as string) && "text-green-600"
            )}
          >
            <AiFillLike /> <span>{formatNumber(replyComment.like.length)}</span>
          </button>
          <button
            onClick={handleDislikeReplyComment}
            className={cn(
              "flex items-center gap-2",
              replyComment.dislike.includes(user?.id as string) &&
                "text-red-500"
            )}
          >
            <AiFillDislike />{" "}
            <span>{formatNumber(replyComment.dislike.length)}</span>
          </button>
          <button onClick={() => setShowInput(!showInput)}>Reply</button>
        </div>

        {showInput && (
          <div className="flex gap-x-3 mt-5">
            <Image
              src={user?.profile || Nami}
              alt="profile"
              width={100}
              height={100}
              className="w-[3rem] h-[3rem] rounded-lg border border-white/40"
              priority
            />
            <form onSubmit={handleReplyComment} className="flex-1">
              <div className="relative">
                <textarea
                  rows={2}
                  name="replyComment"
                  required
                  ref={textareaRef}
                  className="w-full p-2 pr-12 text-black outline-none"
                  placeholder={`Reply to ${replyComment.user.username}`}
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
        )}
      </div>
    </div>
  );
};

export default ReplyCommentCard;
