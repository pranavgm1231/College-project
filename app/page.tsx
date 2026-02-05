import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Index() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-6xl flex justify-between items-center p-3 text-sm">
          <div className="font-bold text-xl flex items-center gap-2">
            SkillBarter
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="py-2 px-3 rounded-md hover:bg-muted transition-colors">Login</Link>
            <Link href="/signup" className="py-2 px-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-10 items-center px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out fill-mode-forwards max-w-4xl pt-10">
        <header className="flex flex-col gap-6 items-center text-center">
          <h1 className="text-4xl lg:text-7xl font-bold tracking-tight">
            Exchange Skills. <br /><span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">No Money Needed.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join a community of learners and teachers. Teach what you know, learn what you want.
            Earn credits by helping others and spend them to master new skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/signup" className="bg-primary text-primary-foreground py-3 px-8 rounded-md font-medium text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Start Bartering
            </Link>
            <Link href="/about" className="py-3 px-8 rounded-md border bg-background hover:bg-muted transition-colors font-medium text-lg">
              How it Works
            </Link>
          </div>
        </header>

        <div className="w-full border rounded-xl p-8 bg-card shadow-sm mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
              <h3 className="font-bold mb-2">Offer a Skill</h3>
              <p className="text-muted-foreground">List what you can teach. From Coding to Cooking.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
              <h3 className="font-bold mb-2">Earn Credits</h3>
              <p className="text-muted-foreground">Help others learn and earn credits in your digital wallet.</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
              <h3 className="font-bold mb-2">Learn Anything</h3>
              <p className="text-muted-foreground">Spend credits to request sessions from experts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
