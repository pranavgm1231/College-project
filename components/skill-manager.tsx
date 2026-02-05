"use client";
import { addSkill, deleteSkill } from "@/app/actions/profile";
import { SubmitButton } from "./submit-button";
import { Trash2, Plus } from "lucide-react";

export function SkillManager({ type, initialSkills }: { type: "OFFERED" | "WANTED", initialSkills: any[] }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                {initialSkills.map(skill => (
                    <div key={skill.id} className="flex items-center justify-between p-3 border rounded-md bg-card shadow-sm group hover:border-primary/30 transition-colors">
                        <div>
                            <div className="font-medium">{skill.title}</div>
                            <div className="text-xs text-muted-foreground badge badge-outline mt-1 inline-block px-2 py-0.5 rounded-full border bg-muted/30">
                                {skill.level.toLowerCase()}
                            </div>
                        </div>
                        <button
                            onClick={() => deleteSkill(skill.id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-md transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Delete skill"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {initialSkills.length === 0 && (
                    <div className="text-sm text-muted-foreground italic text-center p-4 border border-dashed rounded-md">
                        No skills added yet. Add one below!
                    </div>
                )}
            </div>

            <form action={addSkill} className="flex flex-col gap-3 mt-2 p-4 border border-dashed rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Add New Skill</h3>
                <input type="hidden" name="type" value={type} />
                <div className="flex gap-2">
                    <input name="title" placeholder="e.g. React, Spanish, Piano" className="flex-1 border rounded-md px-3 py-2 bg-background text-sm outline-none focus:ring-1 focus:ring-primary" required />
                    <select name="level" className="border rounded-md px-3 py-2 bg-background text-sm outline-none focus:ring-1 focus:ring-primary">
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="EXPERT">Expert</option>
                    </select>
                </div>
                <SubmitButton className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/80 flex items-center justify-center gap-2" pendingText="Adding...">
                    <Plus className="w-4 h-4" /> Add Skill
                </SubmitButton>
            </form>
        </div>
    )
}
