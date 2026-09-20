"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      className="text-sm underline"
      onClick={async () => {
        await signOut({ redirect: false });
        window.location.href = "/";
      }}
    >
      Sign out
    </button>
  );
}
