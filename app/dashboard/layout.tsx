import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { Home, Users, MessageSquare, Settings, User } from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch profile for avatar/name potentially (optional optimization)

    return (
        <div className="flex flex-col min-h-screen w-full bg-muted/40">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
                <Link className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary" href="/dashboard">
                    <span className="font-bold text-xl">SkillBarter</span>
                </Link>
                <nav className="hidden md:flex flex-1 items-center gap-6 text-sm font-medium md:ml-8">
                    <Link className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground" href="/dashboard">
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground" href="/dashboard/explore">
                        <Users className="h-4 w-4" />
                        Explore
                    </Link>
                    <Link className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground" href="/dashboard/messages">
                        <MessageSquare className="h-4 w-4" />
                        Messages
                    </Link>
                </nav>
                <div className="flex items-center gap-4 ml-auto md:gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20">
                        <span>0 Credits</span> {/* TODO: Fetch actual credits */}
                    </div>
                    <Link href="/dashboard/profile" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border">
                            {/* Avatar or Initial */}
                            <User className="h-5 w-5" />
                        </div>
                    </Link>
                    <SignOutButton />
                </div>
            </header>
            <main className="flex-1 flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
