"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import defaultProfile from "@/image/defaultprofile.jpg";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import actionEditProfile from "@/action/profile/actionEditProfile";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { actionChangePassword } from "@/action/profile/actionChangePassword";
import { actionChangeProfile } from "@/action/profile/actionChangeProfile";

interface ProfileRowProp {
  user: {
    id: string;
    username: string;
    email: string;
    profile: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

const SaveButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="bg-red-500 hover:bg-red-400 rounded-full mt-4"
    >
      {pending ? "Loading..." : "Save"}
    </Button>
  );
};

const SavePassButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="bg-red-500 hover:bg-red-400 rounded-full mt-4 w-full"
    >
      {pending ? "Loading..." : "Save"}
    </Button>
  );
};

const ProfileRow = ({ user }: ProfileRowProp) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, dispatchEditProfile] = useFormState(actionEditProfile, null);
  const [statePass, dispatchChangePass] = useFormState(
    actionChangePassword,
    null
  );

  useEffect(() => {
    if (showChangePassword) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showChangePassword]);

  useEffect(() => {
    if (state?.message) {
      toast("Success", {
        description: "Changes save successfully",
        action: {
          label: "X",
          onClick: () => {},
        },
      });
    }

    if (statePass?.message) {
      toast("Success", {
        description: "Change password successfully",
        action: {
          label: "X",
          onClick: () => {},
        },
      });
      ref.current?.reset();
      setShowChangePassword(false);
    }
  }, [state?.message, statePass?.message]);

  return (
    <div className="mt-5 flex-1 max-w-[50rem] mx-3">
      <h1 className="text-2xl font-medium text-center">Hi {user?.username}</h1>

      <div className="mt-10">
        <div className="flex items-center justify-center mb-10">
          <div className="border border-dashed border-zinc-700 rounded-xl bg-zinc-500/10">
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  actionChangeProfile(res[0]?.url);
                }
                toast("Success", {
                  description: "Change profile successfully",
                  action: {
                    label: "X",
                    onClick: () => {},
                  },
                });
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
        </div>

        <div className="md:flex gap-5">
          <div className="shrink-0 md:block flex justify-center md:mb-0 mb-8">
            <Image
              src={user?.profile || defaultProfile}
              alt="profile"
              width={300}
              height={100}
              priority
              className="rounded-full h-[10rem] w-[10rem] object-cover"
            />
          </div>
          <form
            action={(formData: FormData) => {
              const username = formData.get("username");
              const email = formData.get("email");

              if (username === user?.username && email === user?.email) {
                return toast("Ooops!", {
                  description: "No changes made",
                  action: {
                    label: "X",
                    onClick: () => {},
                  },
                });
              }

              dispatchEditProfile(formData);

              router.refresh();
            }}
            className="flex flex-col justify-center flex-1"
          >
            <div className="mb-2">
              <input
                type="text"
                defaultValue={user?.username}
                name="username"
                placeholder="Username"
                className={cn(
                  "p-2 px-5 w-full bg-zinc-800 rounded-full outline-none placeholder:text-sm",
                  state?.errors?.username && "border border-red-500"
                )}
              />
              {state?.errors?.username && (
                <p className="text-sm text-red-500 text-center mt-1">
                  {state.errors.username}
                </p>
              )}
            </div>
            <div className="mb-2">
              <input
                type="email"
                name="email"
                defaultValue={user?.email}
                placeholder="Email"
                className={cn(
                  "p-2 px-5 w-full bg-zinc-800 rounded-full outline-none placeholder:text-sm",
                  state?.errors?.email && "border border-red-500"
                )}
              />
              {state?.errors?.email && (
                <p className="text-sm text-red-500 text-center mt-1">
                  {state.errors.email}
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                className="flex items-center gap-x-2"
              >
                <RiLockPasswordFill />
                Change password
              </button>
            </div>

            <SaveButton />
          </form>

          <div
            className={cn(
              "fixed inset-0 bg-black/50 flex items-center justify-center z-[600] duration-300",
              showChangePassword ? "opacity-1 visible" : "invisible opacity-0"
            )}
          >
            <form
              ref={ref}
              action={dispatchChangePass}
              className="relative flex-1 max-w-[30rem] bg-black py-10 sm:px-10 px-3 border border-zinc-900 rounded-xl mx-3"
            >
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="absolute right-3 top-3 scale-[1.2]"
              >
                <IoClose />
              </button>
              <h1 className="mb-5">Change password</h1>

              <div className="mb-2">
                <input
                  type="password"
                  name="currentPassword"
                  required
                  placeholder="Current password"
                  className={cn(
                    "p-2 px-5 w-full bg-zinc-800 rounded-full outline-none placeholder:text-sm",
                    statePass?.errors?.currentPassword &&
                      "border border-red-500"
                  )}
                />
                {statePass?.errors?.currentPassword && (
                  <p className="text-sm text-red-500 text-center mt-1">
                    {statePass.errors.currentPassword}
                  </p>
                )}
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  name="newPassword"
                  required
                  placeholder="New password"
                  className={cn(
                    "p-2 px-5 w-full bg-zinc-800 rounded-full outline-none placeholder:text-sm",
                    statePass?.errors?.newPassword && "border border-red-500"
                  )}
                />
                {statePass?.errors?.newPassword && (
                  <p className="text-sm text-red-500 text-center mt-1">
                    {statePass.errors.newPassword}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Confirm password"
                  className={cn(
                    "p-2 px-5 w-full bg-zinc-800 rounded-full outline-none placeholder:text-sm",
                    statePass?.errors?.confirmPassword &&
                      "border border-red-500"
                  )}
                />
                {statePass?.errors?.confirmPassword && (
                  <p className="text-sm text-red-500 text-center mt-1">
                    {statePass.errors.confirmPassword}
                  </p>
                )}
              </div>

              <SavePassButton />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRow;
