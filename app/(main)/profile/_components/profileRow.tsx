"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import defaultProfile from "@/image/defaultprofile.jpg";
import actionEditProfile from "@/action/profile/actionEditProfile";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { actionChangeProfile } from "@/action/profile/actionChangeProfile";
import { actionChangePassword } from "@/action/profile/actionChangePassword";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

const ProfileRow = ({ user }: ProfileRowProp) => {
  const [state, dispatch] = useFormState(actionEditProfile, null);
  const [statePassword, dispatchPassword] = useFormState(
    actionChangePassword,
    null
  );
  const router = useRouter();
  const [userProfile, setUserProfile] = useState("");
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (statePassword?.message || state?.message) {
      toast("Success", {
        description: "Saved changes",
        action: {
          label: "X",
          onClick: () => {},
        },
      });
      ref.current?.reset();
      router.refresh();
    }
  }, [statePassword?.message, state?.message, router]);

  return (
    <div className="mt-5 flex-1 max-w-[50rem] mx-3">
      <h1 className="text-2xl font-medium text-center">Hi {user?.username}</h1>

      <div className="mt-10">
        <div className="flex items-center justify-center mb-10">
          <div className="border border-dashed border-zinc-700 rounded-xl bg-zinc-500/10">
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                if (res) {
                  setUserProfile(res[0]?.url);
                }
                alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
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
            ref={ref}
            action={async (formData: FormData) => {
              const currentPassword = formData.get("currentPassword");
              const newPassword = formData.get("newPassword");
              const confirmPassword = formData.get("confirmPassword");
              const email = formData.get("email");
              const username = formData.get("username");

              if (
                email === user?.email &&
                username === user?.username &&
                !userProfile &&
                !currentPassword &&
                !newPassword &&
                !confirmPassword
              ) {
                return toast("No changes made", {
                  action: {
                    label: "X",
                    onClick: () => console.log("Undo"),
                  },
                });
              }

              if (
                (user?.email !== email || username !== user.username) &&
                !currentPassword &&
                !newPassword &&
                !confirmPassword
              ) {
                dispatch(formData);
              }

              if (currentPassword || newPassword || confirmPassword) {
                dispatchPassword(formData);
              }

              if (
                userProfile &&
                !currentPassword &&
                !newPassword &&
                !confirmPassword
              ) {
                actionChangeProfile(userProfile);
              }
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
                  state?.errors?.username && "border-red-500 border"
                )}
              />
              {state?.errors?.username && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {state?.errors?.username}
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
                  state?.errors?.email && "border-red-500 border"
                )}
              />
              {state?.errors?.email && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {state?.errors?.email}
                </p>
              )}
            </div>

            <div className="mb-2">
              <input
                type="password"
                name="currentPassword"
                placeholder="Current password"
                className={cn(
                  "p-2 px-5 w-full bg-zinc-800 rounded-full outline-none placeholder:text-sm",
                  statePassword?.errors?.currentPassword &&
                    "border-red-500 border"
                )}
              />
              {statePassword?.errors?.currentPassword && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {statePassword?.errors?.currentPassword}
                </p>
              )}
            </div>
            <div className="mb-2">
              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                className={cn(
                  "p-2 px-5 w-full bg-zinc-800 rounded-full outline-none placeholder:text-sm",
                  statePassword?.errors?.newPassword && "border-red-500 border"
                )}
              />
              {statePassword?.errors?.newPassword && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {statePassword?.errors?.newPassword}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className={cn(
                  "p-2 px-5 w-full bg-zinc-800 rounded-full outline-none placeholder:text-sm",
                  statePassword?.errors?.confirmPassword &&
                    "border-red-500 border"
                )}
              />
              {statePassword?.errors?.confirmPassword && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {statePassword?.errors?.confirmPassword}
                </p>
              )}
            </div>

            <SaveButton />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileRow;
