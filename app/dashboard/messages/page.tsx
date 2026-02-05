import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function MessagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/login");

    // Fetch exchanges where I am requester OR responder
    const { data: exchanges } = await supabase.from("exchanges")
        .select(`
      *,
      skill:skills!skill_requested_id(title),
      requester:profiles!requester_id(full_name, username),
      responder:profiles!responder_id(full_name, username)
    `)
        .or(`requester_id.eq.${user.id},responder_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <h1 className="text-3xl font-bold tracking-tight">Messages & Exchanges</h1>

            {exchanges && exchanges.length > 0 ? (
                <div className="grid gap-4">
                    {exchanges.map(exchange => {
                        const isRequester = exchange.requester_id === user.id;
                        const partner = isRequester ? exchange.responder : exchange.requester;
                        const skillTitle = exchange.skill?.title || "Unknown Skill";

                        return (
                            <Link href={`/dashboard/messages/${exchange.id}`} key={exchange.id} className="block group">
                                <div className="border rounded-xl p-6 bg-card hover:bg-muted/50 transition-colors shadow-sm flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusColor(exchange.status)}`}>
                                                {exchange.status}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(exchange.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            {skillTitle} <span className="font-normal text-muted-foreground text-sm">with {partner?.full_name || "Unknown"}</span>
                                        </h3>
                                    </div>
                                    <div>
                                        <MessageSquare className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">No active exchanges. Go explore skills!</p>
                    <Link href="/dashboard/explore" className="text-primary hover:underline mt-2 inline-block">Explore Skills</Link>
                </div>
            )}
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200';
        case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}
