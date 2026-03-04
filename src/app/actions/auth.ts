"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const country = formData.get("country") as string;
    const dialCode = formData.get("dialCode") as string;

    if (!email || !password || !fullName) {
        return { error: "All required fields must be filled." };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
    }

    const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (authError) {
        return { error: authError.message };
    }

    // Create coach record if signup was successful
    if (data.user) {
        const slug = fullName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const { error: insertError } = await supabase.from("coaches").insert({
            id: data.user.id,
            email,
            full_name: fullName,
            whatsapp_number: `${dialCode}${whatsapp}`,
            country_code: country,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            coaching_type: ["fitness"],
            plan: "trial",
            checkin_day: 0,
            checkin_time: "19:00",
            slug,
            status: "active",
        });

        if (insertError) {
            console.error("Coach insert error:", insertError);
            // Don't fail — auth succeeded, coach record can be created later
        }
    }

    redirect("/dashboard");
}

export async function logoutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}
