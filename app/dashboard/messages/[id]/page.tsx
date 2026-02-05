import { createClient } from "@/utils/supabase/server";
import { ChatWindow } from "@/components/chat-window";
import { ExchangeActions } from "@/components/exchange-actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ExchangePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/login");

    // Fetch exchange details
    const { data: exchange } = await supabase.from("exchanges")
        .select(`
      *,
      skill:skills!skill_requested_id(*),
      requester:profiles!requester_id(*),
      responder:profiles!responder_id(*)
    `)
        .eq("id", id)
        .single();

    if (!exchange) return <div>Exchange not found</div>;

    // Verify access
    if (exchange.requester_id !== user.id && exchange.responder_id !== user.id) {
        return redirect("/dashboard/messages");
    }

    // Fetch messages
    const { data: messages } = await supabase.from("messages")
        .select("*")
        .eq("exchange_id", id)
        .order("created_at", { ascending: true });

    const partner = exchange.requester_id === user.id ? exchange.responder : exchange.requester;
    const isRequester = exchange.requester_id === user.id;

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/messages" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        {exchange.skill?.title}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Exchange with <span className="font-medium text-foreground">{partner?.full_name}</span>
                    </p>
                </div>
                <ExchangeActions exchange={exchange} currentUserId={user.id} />
            </div>

            <ChatWindow exchangeId={id} messages={messages || []} currentUserId={user.id} />
        </div>
    );
}
