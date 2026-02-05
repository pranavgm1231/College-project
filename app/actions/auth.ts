"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error(error);
        return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/dashboard");
};

export const signUp = async (formData: FormData) => {
    const origin = (await headers()).get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("full_name") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
                full_name: fullName,
                avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
            }
        },
    });

    if (error) {
        console.error(error);
        return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
};

export const signOut = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
};
