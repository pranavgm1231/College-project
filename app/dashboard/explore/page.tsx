import { createClient } from "@/utils/supabase/server";
import { SkillCard } from "@/components/skill-card";
import { redirect } from "next/navigation";

export default async function ExplorePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/login");

    // Fetch my wanted skills
    const { data: myWants } = await supabase.from("skills").select("title").eq("user_id", user.id).eq("type", "WANTED");
    const wantedTitles = myWants?.map(s => s.title.toLowerCase()) || [];

    // Fetch all offered skills (exclude mine)
    // In a real app, this would be paginated and filtered on DB
    const { data: skills } = await supabase.from("skills")
        .select("*, profiles(*)")
        .eq("type", "OFFERED")
        .neq("user_id", user.id);

    // Sorting logic: Matches first
    const sortedSkills = skills?.sort((a, b) => {
        const aMatch = wantedTitles.includes(a.title.toLowerCase());
        const bMatch = wantedTitles.includes(b.title.toLowerCase());
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
    });

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Explore Skills</h1>
                <p className="text-muted-foreground">Find people offering the skills you want to learn.</p>
            </div>

            {wantedTitles.length > 0 && (
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg flex gap-2 items-center text-sm text-primary">
                    <span className="font-bold">You are looking for:</span> {wantedTitles.join(", ")}
                </div>
            )}

            {sortedSkills && sortedSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedSkills.map(skill => (
                        <SkillCard
                            key={skill.id}
                            skill={skill}
                            isMatch={wantedTitles.includes(skill.title.toLowerCase())}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">No skills found. Check back later!</p>
                </div>
            )}
        </div>
    );
}
