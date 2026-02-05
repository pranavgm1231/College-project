"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function requestExchange(skillId: string) {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    // Get skill details to find responder_id
    const { data: skill } = await supabase.from("skills").select("user_id, title").eq("id", skillId).single();
    if (!skill) return;

    // Prevent requesting own skill
    if (skill.user_id === user.data.user.id) {
        return; // Handle error gracefully or redirect
    }

    // Check credits
    const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.data.user.id).single();
    if ((profile?.credits || 0) < 1) {
        // redirect to dashboard or explore with error
        // For now just return or redirect
        return redirect("/dashboard?error=Insufficient credits to make a request");
    }

    // create exchange
    const { data: exchange, error } = await supabase.from("exchanges").insert({
        requester_id: user.data.user.id,
        responder_id: skill.user_id,
        skill_requested_id: skillId,
        status: "PENDING"
    }).select().single();

    if (error) {
        console.error(error);
        // Check for duplicates?
        throw error;
    }

    // Initialize chat with a system message or prompt
    if (exchange) {
        await supabase.from("messages").insert({
            exchange_id: exchange.id,
            sender_id: user.data.user.id,
            content: `Hi! I'm interested in learning ${skill.title}.`
        });
    }

    return redirect("/dashboard/messages");
}

export async function updateExchangeStatus(exchangeId: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch exchange to verify logic
    const { data: exchange } = await supabase.from("exchanges").select("*").eq("id", exchangeId).single();
    if (!exchange) return;

    // Update status
    const { error } = await supabase.from("exchanges").update({ status }).eq("id", exchangeId);
    if (error) throw error;

    // Handle Credits on Completion
    if (status === 'COMPLETED') {
        // Deduct from requester, Add to responder
        // Note: In a real app use a specific RPC or transaction
        const { error: error1 } = await supabase.rpc('increment_credits', { user_id: exchange.responder_id, amount: 1 });
        const { error: error2 } = await supabase.rpc('increment_credits', { user_id: exchange.requester_id, amount: -1 });
    }

    revalidatePath(`/dashboard/messages/${exchangeId}`);
    revalidatePath(`/dashboard/messages`);
}

