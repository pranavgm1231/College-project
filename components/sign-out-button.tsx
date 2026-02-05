"use client";
import { signOut } from "@/app/actions/auth";

export function SignOutButton() {
    return (
        <button onClick={() => signOut()} className="text-sm font-medium transition-colors hover:text-destructive">
            Sign Out
        </button>
    )
}
