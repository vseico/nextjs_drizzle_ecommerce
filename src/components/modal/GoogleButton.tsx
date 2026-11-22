"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

export default function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.pathname + window.location.search,
    });
    if (error) {
      toast.error(error.message || "Google sign in failed");
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-border bg-white py-3 text-sm font-medium text-text transition hover:bg-background disabled:opacity-60"
      >
        <FcGoogle size={20} />
        {pending ? "Redirecting..." : label}
      </button>
      <div className="my-5 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
    </>
  );
}
