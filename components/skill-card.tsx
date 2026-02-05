"use client";
import { requestExchange } from "@/app/actions/exchange";
import { SubmitButton } from "./submit-button";

export function SkillCard({ skill, isMatch }: { skill: any, isMatch: boolean }) {
    const profilename = skill.profiles?.full_name || "Anonymous";
    const requestWithId = requestExchange.bind(null, skill.id);

    return (
        <div className="border rounded-xl p-5 bg-card shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{skill.title}</h3>
                    {isMatch && <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-bold border border-primary/20">Best Match</span>}
                </div>
                <div className="text-sm text-muted-foreground mt-1 badge inline-block px-2 py-0.5 rounded-full border bg-muted/50">{skill.level?.toLowerCase()}</div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs text-secondary-foreground font-bold">
                        {profilename[0]?.toUpperCase()}
                    </div>
                    <div>
                        <span className="text-sm font-medium block">{profilename}</span>
                        <span className="text-xs text-muted-foreground">Trust Score: {skill.profiles?.trust_score ?? 5.0}</span>
                    </div>
                </div>
                {skill.profiles?.bio && <p className="text-xs text-muted-foreground mt-3 line-clamp-2 italic">"{skill.profiles.bio}"</p>}
            </div>

            <form action={requestWithId}>
                <SubmitButton className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm" pendingText="Connecting...">
                    Request to Learn
                </SubmitButton>
            </form>
        </div>
    )
}
