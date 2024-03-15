"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useOpenAuth } from "@/utils/zustand";
import { IoClose } from "react-icons/io5";
import actionSignUp from "@/action/auth/actionSignUp";
import actionSignIn from "@/action/auth/actionSignIn";
import { useFormState, useFormStatus } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";

const SubmitButton = ({ isSignUp }: { isSignUp: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="bg-red-600 hover:bg-red-400 mt-5 p-6 text-[15px] rounded"
    >
      {isSignUp ? (
        <span>{pending ? "Loading..." : "Sign Up"}</span>
      ) : (
        <span>{pending ? "Loading..." : "Sign In"}</span>
      )}
    </Button>
  );
};

const Signin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const setIsClose = useOpenAuth((state) => state.setIsClose);
  const isOpen = useOpenAuth((state) => state.isOpen);
  const [state, formAction] = useFormState(actionSignUp, null);
  const [stateSignIn, dispatch] = useFormState(actionSignIn, null);
  const queryClient = useQueryClient();

  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message?.id) {
      setIsSignUp(false);
    }

    if (stateSignIn?.message?.id) {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setIsClose();
    }
  }, [state?.message, stateSignIn?.message, setIsClose, queryClient]);

  if (!isOpen) return;

  return (
    <div className="flex items-center justify-center fixed inset-0 bg-black/60 text-white z-[600]">
      <div className="sm:px-[3.5rem] px-10 py-12 bg-black rounded flex-1 max-w-[27rem] mx-3 relative">
        <button
          onClick={() => {
            setIsClose();
            ref.current?.reset();
          }}
          className="absolute right-3 top-3 text-xl text-zinc-400 hover:text-red-500"
        >
          <IoClose />
        </button>
        <h1 className="text-2xl font-bold mb-7">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>

        <form
          ref={ref}
          action={async (formData: FormData) => {
            isSignUp ? formAction(formData) : dispatch(formData);
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Username"
            name="username"
            required
            maxLength={15}
            className="p-3 text-sm outline-none flex-1 rounded bg-zinc-800"
          />
          {state?.errors?.username && isSignUp && (
            <p className="text-sm text-red-500">{state.errors.username}</p>
          )}
          {stateSignIn?.errors?.username && !isSignUp && (
            <p className="text-sm text-red-500">
              {stateSignIn?.errors?.username}
            </p>
          )}

          {isSignUp && (
            <>
              <input
                type="email"
                required
                placeholder="Email"
                name="email"
                className="p-3 text-sm outline-none flex-1 rounded bg-zinc-800"
              />
              {state?.errors?.email && (
                <p className="text-sm text-red-500">{state.errors.email}</p>
              )}
            </>
          )}

          <input
            type="password"
            required
            placeholder="Password"
            name="password"
            className="p-3 text-sm outline-none flex-1 rounded bg-zinc-800"
          />
          {state?.errors?.password && isSignUp && (
            <p>{state.errors.password}</p>
          )}
          {stateSignIn?.errors?.password && !isSignUp && (
            <p className="text-sm text-red-500">
              {stateSignIn?.errors?.password}
            </p>
          )}

          <SubmitButton isSignUp={isSignUp} />
          {!isSignUp && (
            <p className="text-sm text-zinc-500">Forgot password?</p>
          )}
        </form>

        <div className="mt-24 text-[14px]">
          <p>
            <span className="text-zinc-500">
              {isSignUp ? "Already a User?" : "New to LuffyTaro?"}
            </span>{" "}
            <span
              className="cursor-pointer"
              onClick={() => {
                setIsSignUp((prev) => (prev ? false : true));
                ref.current?.reset();
              }}
            >
              {isSignUp ? "Sign in now" : "Sign up now"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
