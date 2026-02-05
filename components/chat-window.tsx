"use client";
import { sendMessage } from "@/app/actions/message";
import { SubmitButton } from "./submit-button";
import { useRef, useEffect } from "react";
import { Send } from "lucide-react";

export function ChatWindow({ exchangeId, messages, currentUserId }: { exchangeId: string, messages: any[], currentUserId: string }) {
    const formRef = useRef<HTMLFormElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-[500px] border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-muted/5">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] rounded-lg p-3 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted border"}`}>
                                {msg.content}
                                <div className={`text-[10px] mt-1 opacity-70 ${isMe ? "text-right" : "text-left"}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={bottomRef} />
            </div>

            <form
                ref={formRef}
                action={async (formData) => {
                    await sendMessage(formData);
                    formRef.current?.reset();
                }}
                className="p-3 border-t bg-background flex gap-2"
            >
                <input type="hidden" name="exchangeId" value={exchangeId} />
                <input
                    name="content"
                    className="flex-1 border rounded-md px-3 py-2 bg-muted/20 focus:bg-background outline-none focus:ring-1 focus:ring-primary transition-colors text-sm"
                    placeholder="Type a message..."
                    required
                    autoComplete="off"
                />
                <SubmitButton className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors" pendingText="">
                    <Send className="w-5 h-5" />
                </SubmitButton>
            </form>
        </div>
    )
}
