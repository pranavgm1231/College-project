"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const full_name = formData.get("full_name") as string;
    const bio = formData.get("bio") as string;
    // TODO: Avatar upload logic

    const { error } = await supabase.from("profiles").update({ full_name, bio }).eq("id", user.id);

    if (error) {
        console.error("Error updating profile:", error);
        throw new Error("Failed to update profile");
    }

    revalidatePath("/dashboard/profile");
}

export async function addSkill(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const title = formData.get("title") as string;
    const type = formData.get("type") as "OFFERED" | "WANTED";
    const level = formData.get("level") as string; // BEGINNER, INTERMEDIATE, EXPERT

    const { error } = await supabase.from("skills").insert({
        user_id: user.id,
        title,
        type,
        level
    });

    if (error) {
        console.error("Error adding skill:", error);
    }
    revalidatePath("/dashboard/profile");
}

export async function deleteSkill(skillId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("skills").delete().match({ id: skillId, user_id: user.id });
    revalidatePath("/dashboard/profile");
}
