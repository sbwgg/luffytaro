import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { BsEmojiSmileFill, BsThreeDotsVertical } from "react-icons/bs";
import { format } from "timeago.js";
import Nami from "@/image/defaultprofile.jpg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actionLikeReplyComment } from "@/action/replyComment/actionLikeReplyComment";
import { CommentsType, ReplyCommentType } from "./commentRow";
import { actionDislikeReplyComment } from "@/action/replyComment/actionDislikeReplyComment";
import { actionReplyComment } from "@/action/replyComment/actionReplyComment";
import { useOpenAuth } from "@/lib/zustand";
import EmojiPicker from "emoji-picker-react";
import { formatNumber } from "@/utils/formatNumber";
import TextareaAutosize from "react-textarea-autosize";
import { actionSaveEditedReplyComment } from "@/action/replyComment/actionSaveEditedReplyComment";
import { actionDeleteReplyComment } from "@/action/replyComment/actionDeleteReplyComment";
import { toast } from "sonner";
import { actionNotifLikeDislikeReplyComment } from "@/action/notification/actionNotifLikeDislikeReplyComment";

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
    isEdited: boolean;
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
  infoId: string;
  ep: string;
  crId: string;
}

const ReplyCommentCard = ({
  replyComment,
  user,
  commentId,
  socket,
  infoId,
  ep,
  crId,
}: ReplyCommentCardProp) => {
  const [showInput, setShowInput] = useState(false);
  const queryClient = useQueryClient();
  const setIsOpen = useOpenAuth((state) => state.setIsOpen);
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editComment, setEditComment] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const replyCommentRef = useRef<HTMLParagraphElement>(null);

  const mutationLikeReplyComment = useMutation({
    mutationFn: async () => {
      try {
        await actionLikeReplyComment(replyComment.id, user?.id);
      } catch (e) {
        console.log(e);
      }
    },
    onSuccess: async () => {
      const data = await actionNotifLikeDislikeReplyComment(
        user?.id,
        replyComment.user.id,
        replyComment.id,
        infoId,
        ep
      );
      socket.current.emit("sendNotification", {
        data,
        notifRecieverId: replyComment.user.id,
      });
    },
    onMutate: () => {
      const isLiked = replyComment.like.includes(user?.id as string);
      if (isLiked) {
        queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
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
        queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
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
    onSuccess: async () => {
      const data = await actionNotifLikeDislikeReplyComment(
        user?.id,
        replyComment.user.id,
        replyComment.id,
        infoId,
        ep
      );
      socket.current.emit("sendNotification", {
        data,
        notifRecieverId: replyComment.user.id,
      });
    },
    onMutate: () => {
      const isDisliked = replyComment.dislike.includes(user?.id as string);
      if (isDisliked) {
        queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
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
        queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
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
          replyComment.user.id,
          infoId,
          ep,
          replyComment.user.username
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
          notifRecieverId: replyComment.user.id,
        });
      }
    },
  });

  const handleReplyComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) return setIsOpen();

    const formData = new FormData(e.currentTarget);
    mutationReplyComment.mutate(formData);
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

  const mutationSaveEditedReplyComment = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const data = await actionSaveEditedReplyComment(
          formData,
          replyComment.id
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      setEditComment(false);
      socket.current.emit("sendSaveEditedReplyComent", data);
      toast("Success", {
        description: "Edited Successfully",
      });
    },
    onMutate: (variable) => {
      queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
        old?.map((item) =>
          item.id === commentId
            ? {
                ...item,
                replyComment: item.replyComment.map((item) =>
                  item.id === replyComment.id
                    ? ({
                        ...item,
                        replyComment: variable.get("editedReplyComment"),
                        isEdited: true,
                      } as ReplyCommentType)
                    : item
                ),
              }
            : item
        )
      );
    },
  });

  const handleSaveEditedReplyComment = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutationSaveEditedReplyComment.mutate(formData);
  };

  const isMyReplyComment = user?.id === replyComment.user.id;

  const mutationDeleteReplyComment = useMutation({
    mutationFn: async () => {
      try {
        const data = await actionDeleteReplyComment(replyComment.id);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      socket.current.emit("sendDeleteReplyComment", data);
      toast("Success", {
        description: "Deleted Successfully",
      });
    },
    onMutate: () => {
      queryClient.setQueryData<CommentsType[]>(["comments", ep], (old) =>
        old?.map((item) =>
          item.id === commentId
            ? {
                ...item,
                replyComment: item.replyComment.filter(
                  (item) => item.id !== replyComment.id
                ),
              }
            : item
        )
      );
    },
  });

  const DeletePopup = () => {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-black/20 z-[600]">
        <div className="border border-zinc-600 p-5 text-white bg-black flex-1 max-w-[25rem] mx-3">
          <div className="sm:p-5 p-1">
            <h1 className="text-lg mb-2">Delete Comment</h1>
            <p className="sm:text-sm text-zinc-400">
              Delete your comment permanently?
            </p>
          </div>
          <div className="flex gap-2 justify-end mt-5">
            <button
              onClick={() => setDeletePopup(false)}
              className="bg-white p-1 px-3 text-black text-base"
            >
              Cancel
            </button>
            <button
              aria-disabled={mutationDeleteReplyComment.isPending}
              onClick={() => mutationDeleteReplyComment.mutate()}
              className="bg-red-500 p-1 px-3 text-base"
            >
              {mutationDeleteReplyComment.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (replyComment.id === crId) {
      replyCommentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [replyComment.id, crId]);

  return (
    <div className="flex gap-3 mb-5">
      <Image
        src={replyComment.user.profile || Nami}
        alt="profile"
        width={100}
        height={100}
        className="sm:w-[3rem] w-[2.5rem] h-[2.5rem] sm:h-[3rem] rounded-lg border border-white/40"
        priority
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p>{replyComment.user.username}</p>
          {isMyReplyComment && (
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
          {format(replyComment.createdAt)}{" "}
          {replyComment.isEdited && <span>&#8226;</span>}{" "}
          {replyComment.isEdited ? "edited" : ""}
        </p>
        <div>
          {editComment && isMyReplyComment ? (
            <form onSubmit={handleSaveEditedReplyComment}>
              <TextareaAutosize
                name="editedReplyComment"
                required
                className="p-2 outline-none w-full bg-inherit resize-none border border-zinc-800"
                defaultValue={replyComment.replyComment}
              />
              <div className="flex justify-end">
                <Button
                  disabled={mutationSaveEditedReplyComment.isPending}
                  className="text-xs"
                >
                  {mutationSaveEditedReplyComment.isPending
                    ? "Loading..."
                    : "Save"}
                </Button>
              </div>
            </form>
          ) : (
            <p
              ref={replyCommentRef}
              className={cn(
                "relative break-words break-all whitespace-pre-wrap text-sm",
                replyComment.spoiler && "blur-[3px]",
                replyComment.id === crId && "font-extrabold"
              )}
            >
              {replyComment.replyTo ? (
                <span className="text-sm text-green-400">
                  @{replyComment.replyTo}
                </span>
              ) : null}{" "}
              {replyComment.replyComment}
            </p>
          )}
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
          <button onClick={() => setShowInput(!showInput)}>
            {showInput ? "Cancel" : "Reply"}
          </button>
          {isMyReplyComment && (
            <button onClick={() => setEditComment(!editComment)}>
              {editComment ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

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
                  name="replyComment"
                  required
                  ref={textareaRef}
                  className="w-full p-2 sm:pr-12 text-black outline-none"
                  placeholder={`Reply to ${replyComment.user.username}`}
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
      </div>
    </div>
  );
};

export default ReplyCommentCard;
