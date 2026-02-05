"use client";

import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
import { Loader2 } from "lucide-react";

type Props = ComponentProps<"button"> & {
    pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
    const { pending } = useFormStatus();

    return (
        <button
            {...props}
            type="submit"
            aria-disabled={pending}
            disabled={pending}
        >
            {pending ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    {pendingText}
                </span>
            ) : (
                children
            )}
        </button>
    );
}
