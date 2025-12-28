"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const supabase = await createClient();

    // Validate form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect("/login?error=Invalid login credentials");
    }

    return redirect("/eventos");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    // Validate form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
}
