"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendMessage(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const exchangeId = formData.get("exchangeId") as string;
    const content = formData.get("content") as string;

    if (!content || !exchangeId) return;

    const { error } = await supabase.from("messages").insert({
        exchange_id: exchangeId,
        sender_id: user.id,
        content
    });

    if (error) {
        console.error("Error sending message:", error);
    }

    revalidatePath(`/dashboard/messages/${exchangeId}`);
}
