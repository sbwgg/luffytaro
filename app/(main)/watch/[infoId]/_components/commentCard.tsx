import React, { FormEvent, useEffect, useRef, useState } from "react";
import { CommentsType } from "./commentRow";
import Image from "next/image";
import { format } from "timeago.js";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { cn } from "@/lib/utils";
import Nami from "@/image/defaultprofile.jpg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actionLikeComment } from "@/action/comment/actionLikeComment";
import { actionDislikeComment } from "@/action/comment/actionDislikeComment";
import { BsEmojiSmileFill, BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { actionReplyComment } from "@/action/replyComment/actionReplyComment";
import ReplyCommentCard from "./replyCommentCard";
import { useOpenAuth } from "@/lib/zustand";
import EmojiPicker from "emoji-picker-react";
import { formatNumber } from "@/utils/formatNumber";
import TextareaAutosize from "react-textarea-autosize";
import { actionSaveEditedComment } from "@/action/comment/actionSaveEditedComment";
import { actionDeleteComment } from "@/action/comment/actionDeleteComment";
import { toast } from "sonner";
import { actionNotifLikeDislikeComment } from "@/action/notification/actionNotifLikeDislikeComment";

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
  infoId: string;
  ep: string;
  crId: string;
}

const CommentCard = ({
  comment,
  user,
  socket,
  infoId,
  ep,
  crId,
}: CommentCardProp) => {
  const queryClient = useQueryClient();
  const [showInput, setShowInput] = useState(false);
  const setIsOpen = useOpenAuth((state) => state.setIsOpen);
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const commentRef = useRef<HTMLParagraphElement>(null);

  const mutationLikeComment = useMutation({
    mutationFn: async () => {
      try {
        await actionLikeComment(comment.id, user?.id);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: async () => {
      const data = await actionNotifLikeDislikeComment(
        user?.id,
        comment.user.id,
        comment.id,
        infoId,
        ep
      );
      socket.current.emit("sendNotification", {
        data,
        notifRecieverId: comment.user.id,
      });
    },
    onMutate: () => {
      const isLiked = comment.like.includes(user?.id as string);
      if (isLiked) {
        queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
          old?.map((item) =>
            item.id === comment.id
              ? { ...item, like: item.like.filter((id) => id !== user?.id) }
              : item
          )
        );
      } else {
        queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
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
    onSuccess: async () => {
      const data = await actionNotifLikeDislikeComment(
        user?.id,
        comment.user.id,
        comment.id,
        infoId,
        ep
      );
      socket.current.emit("sendNotification", {
        data,
        notifRecieverId: comment.user.id,
      });
    },
    onMutate: () => {
      const isDisliked = comment.dislike.includes(user?.id as string);
      if (isDisliked) {
        queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
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
        queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
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
        const data = await actionReplyComment(
          formData,
          comment.id,
          user?.id,
          comment.user.id,
          infoId,
          ep
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
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
        socket.current.emit("sendNotification", {
          data,
          notifRecieverId: comment.user.id,
        });
      }
    },
  });

  const handleReplyComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) return setIsOpen();

    const formData = new FormData(e.currentTarget);
    mutationReplyComment.mutate(formData);
    setShowReplies(true);
    setShowEmoji(false);
    setShowInput(false);
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

  const mutationSaveEditedComment = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const data = await actionSaveEditedComment(formData, comment.id);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      socket.current.emit("sendSaveEditedComment", data);
      toast("Success", {
        description: "Edited Successfully",
      });
      setEditComment(false);
    },
    onMutate: (variable) => {
      queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
        old?.map((item) =>
          item.id === comment.id
            ? {
                ...item,
                comment: variable.get("editedComment") as string,
                isEdited: true,
              }
            : item
        )
      );
    },
  });

  const handleSaveEditedComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutationSaveEditedComment.mutate(formData);
  };

  const isMyComment = user?.id === comment.user.id;

  const mutationDeleteComment = useMutation({
    mutationFn: async () => {
      try {
        const data = await actionDeleteComment(comment.id);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      socket.current.emit("sendDeleteComment", data);
      toast("Success", {
        description: "Deleted Successfully",
      });
    },
    onMutate: () => {
      queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
        old?.filter((item) => item.id !== comment.id)
      );
    },
  });

  const DeletePopup = () => {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-black/20 z-[600]">
        <div className="border border-zinc-600 p-5 text-white bg-black flex-1 max-w-[25rem] mx-3">
          <div className="sm:p-5 p-1">
            <h1 className="text-lg mb-2">Delete Comment</h1>
            <p className="text-zinc-400">Delete your comment permanently?</p>
          </div>
          <div className="flex gap-2 justify-end mt-5">
            <button
              onClick={() => setDeletePopup(false)}
              className="bg-white p-1 px-3 text-black text-base"
            >
              Cancel
            </button>
            <button
              disabled={mutationDeleteComment.isPending}
              onClick={() => mutationDeleteComment.mutate()}
              className="bg-red-500 p-1 px-3 text-base"
            >
              {mutationDeleteComment.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (comment.id === crId) {
      commentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [comment.id, crId]);

  const replyCommentNotif = comment.replyComment.find(
    (item) => item.id === crId
  );

  useEffect(() => {
    if (replyCommentNotif) {
      setShowReplies(true);
    }
  }, [replyCommentNotif, setShowReplies]);

  return (
    <div className="flex gap-3">
      <div>
        <div className="relative shrink-0">
          <Image
            src={comment.user.profile || Nami}
            alt="profile"
            width={100}
            height={100}
            priority
            className="sm:w-[3rem] w-[2.5rem] h-[2.5rem] sm:h-[3rem] rounded-lg border border-white/40"
          />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p>{comment.user.username}</p>
          {isMyComment && (
            <div className="relative">
              <button onClick={() => setShowMore(!showMore)}>
                <BsThreeDotsVertical />
              </button>

              {showMore && (
                <div className="absolute -left-[6rem] top-0 text-sm bg-white text-black">
                  <button
                    onClick={() => {
                      setShowMore(false);
                      setDeletePopup(true);
                    }}
                    className="p-2 px-5"
                  >
                    Delete
                  </button>
                </div>
              )}
              {deletePopup && <DeletePopup />}
            </div>
          )}
        </div>
        <p className="flex gap-2 text-xs text-zinc-400 mb-2">
          {format(comment.createdAt)} {comment.isEdited && <span>&#8226;</span>}{" "}
          {comment.isEdited ? "edited" : ""}
        </p>
        <div>
          {editComment && isMyComment ? (
            <form onSubmit={handleSaveEditedComment}>
              <TextareaAutosize
                name="editedComment"
                required
                className="p-2 outline-none w-full bg-inherit resize-none border border-zinc-800"
                defaultValue={comment.comment}
              />
              <div className="flex justify-end">
                <Button
                  disabled={mutationSaveEditedComment.isPending}
                  className="text-xs"
                >
                  {mutationSaveEditedComment.isPending ? "Loading..." : "Save"}
                </Button>
              </div>
            </form>
          ) : (
            <p
              ref={commentRef}
              className={cn(
                "relative break-words break-all whitespace-pre-wrap text-sm",
                comment.spoiler && "blur-[3px]",
                crId === comment.id && "font-semibold"
              )}
            >
              {comment.comment}
            </p>
          )}

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
          <button onClick={() => setShowInput(!showInput)}>
            {showInput ? "Cancel" : "Reply"}
          </button>
          {isMyComment && (
            <button onClick={() => setEditComment(!editComment)}>
              {editComment ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {/*  Reply Comment Input  */}

        {showInput && (
          <div className="flex gap-x-3 mt-5">
            <Image
              src={user?.profile || Nami}
              alt="profile"
              width={100}
              height={100}
              className="sm:w-[3rem] w-[2.5rem] h-[2.5rem] sm:h-[3rem] rounded-lg border border-white/40"
              priority
            />
            <form onSubmit={handleReplyComment} className="flex-1">
              <div className="relative">
                <textarea
                  rows={2}
                  ref={textareaRef}
                  name="replyComment"
                  required
                  className="w-full p-2 sm:pr-12 text-black outline-none"
                  placeholder={`Reply to ${comment.user.username}`}
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
                      className="rounded-full accent-red-500"
                    />
                    <p>Spoiler?</p>
                  </div>
                </div>
                <Button className="text-xs">Comment</Button>
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
                infoId={infoId}
                ep={ep}
                crId={crId}
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
