import React, { FormEvent, useRef, useState } from "react";
import { CommentsType } from "./commentRow";
import Image from "next/image";
import { format } from "timeago.js";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { cn } from "@/lib/utils";
import Nami from "@/image/defaultprofile.jpg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actionLikeComment } from "@/action/comment/actionLikeComment";
import { actionDislikeComment } from "@/action/comment/actionDislikeComment";
import { BsEmojiSmileFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { actionReplyComment } from "@/action/replyComment/actionReplyComment";
import ReplyCommentCard from "./replyCommentCard";
import { useOpenAuth } from "@/lib/zustand";
import EmojiPicker from "emoji-picker-react";
import { formatNumber } from "@/utils/formatNumber";

interface CommentCardProp {
  comment: CommentsType;
  user: {
    id: string;
    username: string;
    email: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  socket: any;
}

const CommentCard = ({ comment, user, socket }: CommentCardProp) => {
  const queryClient = useQueryClient();
  const [showInput, setShowInput] = useState(false);
  const setIsOpen = useOpenAuth((state) => state.setIsOpen);
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showReplies, setShowReplies] = useState(false);

  const mutationLikeComment = useMutation({
    mutationFn: async () => {
      try {
        actionLikeComment(comment.id, user?.id);
      } catch (error) {
        console.log(error);
      }
    },
    onMutate: () => {
      const isLiked = comment.like.includes(user?.id as string);
      if (isLiked) {
        queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
          old?.map((item) =>
            item.id === comment.id
              ? { ...item, like: item.like.filter((id) => id !== user?.id) }
              : item
          )
        );
      } else {
        queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
          old?.map((item) =>
            item.id === comment.id
              ? ({
                  ...item,
                  like: [...item.like, user?.id],
                  dislike: item.dislike.filter((id) => id !== user?.id),
                } as CommentsType)
              : item
          )
        );
      }
    },
  });

  const mutationDislikeComment = useMutation({
    mutationFn: async () => {
      try {
        await actionDislikeComment(comment.id, user?.id);
      } catch (error) {
        console.log(error);
      }
    },
    onMutate: () => {
      const isDisliked = comment.dislike.includes(user?.id as string);
      if (isDisliked) {
        queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
          old?.map((item) =>
            item.id === comment.id
              ? {
                  ...item,
                  dislike: item.dislike.filter((id) => id !== user?.id),
                }
              : item
          )
        );
      } else {
        queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
          old?.map((item) =>
            item.id === comment.id
              ? ({
                  ...item,
                  dislike: [...item.dislike, user?.id],
                  like: item.like.filter((id) => id !== user?.id),
                } as CommentsType)
              : item
          )
        );
      }
    },
  });

  const handleLikeComment = () => {
    if (!user?.id) return setIsOpen();

    mutationLikeComment.mutate();
  };

  const handleDislikeComment = () => {
    if (!user?.id) return setIsOpen();

    mutationDislikeComment.mutate();
  };

  const mutationReplyComment = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const data = await actionReplyComment(formData, comment.id, user?.id);
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
    setShowReplies(true);
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
    <div className="flex gap-3">
      <Image
        src={comment.user.profile || Nami}
        alt="profile"
        width={100}
        height={100}
        priority
        className="w-[3rem] h-[3rem] rounded-lg shrink-0 border border-white/40"
      />

      <div className="flex-1">
        <p>{comment.user.username}</p>
        <p className="text-xs text-zinc-400 mb-2">
          {format(comment.createdAt)}
        </p>
        <div>
          <p
            className={cn(
              "relative break-words break-all whitespace-pre-wrap",
              comment.spoiler && "blur-[3px]"
            )}
          >
            {comment.comment}
          </p>

          {comment.spoiler && (
            <button
              onClick={() =>
                queryClient.setQueryData<CommentsType[]>(["comments"], (old) =>
                  old?.map((item) =>
                    item.id === comment.id ? { ...item, spoiler: false } : item
                  )
                )
              }
              className="bg-white text-black text-xs p-1 mt-2"
            >
              Show spoiler
            </button>
          )}
        </div>
        <div
          className={cn(
            "flex items-center gap-5 mt-2 text-zinc-400 text-sm",
            !showReplies && "mb-5"
          )}
        >
          <button
            onClick={handleLikeComment}
            className={cn(
              "flex items-center gap-2",
              comment.like.includes(user?.id as string) && "text-green-600"
            )}
          >
            <AiFillLike /> <span>{formatNumber(comment.like.length)}</span>
          </button>
          <button
            onClick={handleDislikeComment}
            className={cn(
              "flex items-center gap-2",
              comment.dislike.includes(user?.id as string) && "text-red-500"
            )}
          >
            <AiFillDislike />{" "}
            <span>{formatNumber(comment.dislike.length)}</span>
          </button>
          <button onClick={() => setShowInput(!showInput)}>Reply</button>
        </div>

        {/*  Reply Comment Input  */}

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
                  ref={textareaRef}
                  name="replyComment"
                  required
                  className="w-full p-2 pr-12 text-black outline-none"
                  placeholder={`Reply to ${comment.user.username}`}
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

        {showReplies && (
          <div className="flex-1 mt-5">
            {comment.replyComment.map((r) => (
              <ReplyCommentCard
                key={r.id}
                replyComment={r}
                user={user}
                commentId={comment.id}
                socket={socket}
              />
            ))}
          </div>
        )}

        {comment.replyComment.length >= 1 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="mb-5 text-sm text-red-500"
          >
            {showReplies
              ? "Show Less"
              : `Show ${comment.replyComment.length} ${
                  comment.replyComment.length > 1 ? "Replies" : "Reply"
                }`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
