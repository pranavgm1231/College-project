import { createClient } from "@/utils/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { SkillManager } from "@/components/skill-manager";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    const { data: skills } = await supabase.from("skills").select("*").eq("user_id", user.id);

    const offeredSkills = skills?.filter(s => s.type === "OFFERED") || [];
    const wantedSkills = skills?.filter(s => s.type === "WANTED") || [];

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between pb-6 border-b">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your public persona and skills.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        Trust Score: {profile?.trust_score ?? 5.0}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            User Details
                        </h2>
                        <ProfileForm profile={profile} />
                    </section>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-10">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-primary">Skills You Offer</h2>
                        <p className="text-sm text-muted-foreground mb-4">These are skills you can teach to others to earn credits.</p>
                        <SkillManager type="OFFERED" initialSkills={offeredSkills} />
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-purple-600">Skills You Want</h2>
                        <p className="text-sm text-muted-foreground mb-4">These are skills you want to learn. We'll find matches for you.</p>
                        <SkillManager type="WANTED" initialSkills={wantedSkills} />
                    </section>
                </div>
            </div>
        </div>
    );
}
