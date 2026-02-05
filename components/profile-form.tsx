"use client";
import { updateProfile } from "@/app/actions/profile";
import { SubmitButton } from "./submit-button";

export function ProfileForm({ profile }: { profile: any }) {
    return (
        <form action={updateProfile} className="flex flex-col gap-4 border p-6 rounded-lg bg-card shadow-sm">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Full Name</label>
                <input name="full_name" defaultValue={profile?.full_name} className="border rounded-md px-3 py-2 bg-inherit focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea name="bio" defaultValue={profile?.bio} className="border rounded-md px-3 py-2 bg-inherit min-h-[100px] focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Tell the community about yourself..." />
            </div>

            <div className="pt-2">
                <SubmitButton className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors" pendingText="Saving...">Save Changes</SubmitButton>
            </div>
        </form>
    )
}
