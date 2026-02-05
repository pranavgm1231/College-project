"use client";
import { updateExchangeStatus } from "@/app/actions/exchange";
import { SubmitButton } from "./submit-button";
import { Check, X, Award } from "lucide-react";

export function ExchangeActions({ exchange, currentUserId }: { exchange: any, currentUserId: string }) {
    const isRequester = exchange.requester_id === currentUserId;
    const isResponder = exchange.responder_id === currentUserId;
    const status = exchange.status;

    const updateStatus = updateExchangeStatus.bind(null, exchange.id);

    if (status === 'PENDING') {
        if (isResponder) {
            return (
                <div className="flex gap-2">
                    <form action={() => updateStatus('ACCEPTED')}>
                        <SubmitButton className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center gap-2" pendingText="Accepting...">
                            <Check className="w-4 h-4" /> Accept Request
                        </SubmitButton>
                    </form>
                    <form action={() => updateStatus('REJECTED')}>
                        <SubmitButton className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 flex items-center gap-2" pendingText="Rejecting...">
                            <X className="w-4 h-4" /> Decline
                        </SubmitButton>
                    </form>
                </div>
            )
        } else {
            return <div className="text-sm text-muted-foreground italic bg-muted/20 px-3 py-1 rounded-full">Waiting for response...</div>
        }
    }

    if (status === 'ACCEPTED') {
        return (
            <div className="flex gap-2 items-center">
                <div className="text-sm text-green-600 font-medium px-3 py-1 bg-green-50 rounded-full border border-green-100">In Progress</div>
                <form action={() => updateStatus('COMPLETED')}>
                    <SubmitButton className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm" pendingText="Completing...">
                        <Award className="w-4 h-4" /> Mark as Completed
                    </SubmitButton>
                </form>
            </div>
        )
    }

    if (status === 'COMPLETED') {
        return <div className="text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-2"><Award className="w-4 h-4" /> Completed</div>
    }

    return <div className="text-sm text-muted-foreground">{status}</div>;
}
