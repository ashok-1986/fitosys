"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { validateRequest, loginSchema, signupSchema } from "@/lib/validation";
import { loginRateLimit, signupRateLimit } from "@/lib/rate-limit";
import { logError, logEvent } from "@/lib/loggerHelpers";
import { generateUniqueSlug } from "@/lib/slug";
import { getAllowedRedirectUrl } from "@/lib/auth/getAllowedRedirectUrl";

export type AuthResult =
  | { success: true }
  | {
    success: false;
    error: string;
    code: "RATE_LIMITED" | "VALIDATION" | "AUTH" | "SERVER";
  };

export async function loginAction(formData: FormData): Promise<AuthResult> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";

  // 1. Rate limit
  const { success: allowed } = await loginRateLimit.limit(ip);
  if (!allowed) {
    return {
      success: false,
      error: "Too many login attempts. Please try again in 15 minutes.",
      code: "RATE_LIMITED",
    };
  }

  logEvent("auth.login.attempt", { ip });

  // 2. Validate
  const validation = validateRequest(
    {
      email: formData.get("email"),
      password: formData.get("password"),
    },
    loginSchema
  );

  if (!validation.success) {
    const msg = Object.values(validation.errors)[0]?.[0] ?? "Invalid input";
    return { success: false, error: msg, code: "VALIDATION" };
  }

  const { email, password } = validation.data;

  // 3. Supabase Auth
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logEvent("auth.login.failed", { ip, reason: error.message });
      return {
        success: false,
        error: "Invalid email or password.",
        code: "AUTH",
      };
    }

    logEvent("auth.login.success", { email });
  } catch (err) {
    logError(err, "loginAction");
    return {
      success: false,
      error: "Login failed. Please try again.",
      code: "SERVER",
    };
  }

  redirect("/dashboard");
}

export async function signupAction(formData: FormData): Promise<AuthResult> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";

  // 1. Rate limit
  const { success: allowed } = await signupRateLimit.limit(ip);
  if (!allowed) {
    return {
      success: false,
      error: "Too many signup attempts from this IP. Please try again in 60 minutes.",
      code: "RATE_LIMITED",
    };
  }

  logEvent("auth.signup.attempt", { ip });

  // 2. Validate
  const validation = validateRequest(
    {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      password: formData.get("password"),
      whatsapp_number: formData.get("whatsapp_number"),
      country: formData.get("country"),
    },
    signupSchema
  );

  if (!validation.success) {
    const msg = Object.values(validation.errors)[0]?.[0] ?? "Invalid input";
    return { success: false, error: msg, code: "VALIDATION" };
  }

  const { full_name, email, password, whatsapp_number, country } =
    validation.data;

  // 3. Supabase Auth + DB Insert
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (authError) {
      logEvent("auth.signup.failed", { ip, reason: authError.message });
      return {
        success: false,
        error: authError.message,
        code: "AUTH",
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Account creation failed. Please try again.",
        code: "SERVER",
      };
    }

    // 4. Generate unique slug
    const slug = await generateUniqueSlug(full_name);

    const dialCode = formData.get("dialCode") as string || "+91";
    const localNumber = (formData.get("whatsapp_number") as string || "").replace(/^0+/, "");
    const fullWhatsapp = `${dialCode}${localNumber}`;

    // 5. DB insert — separate failure mode (auth already succeeded)
    const { error: dbError } = await supabase.from("coaches").insert({
      id: authData.user.id,
      email,
      full_name,
      whatsapp_number: fullWhatsapp,
      country_code: country,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      coaching_type: ["fitness"],
      plan: "trial",
      checkin_day: 0,
      checkin_time: "19:00",
      slug,
      status: "active",
    });

    if (dbError) {
      logError(dbError, "signupAction.coachInsert");
      return {
        success: false,
        error: "Account created but profile setup failed. Please contact support.",
        code: "SERVER",
      };
    }

    logEvent("auth.signup.success", { email, country, slug });
  } catch (err) {
    logError(err, "signupAction");
    return {
      success: false,
      error: "Signup failed. Please try again.",
      code: "SERVER",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function googleSignInAction() {
  const supabase = await createClient();

  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") ??
    headersList.get("host") ??
    "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;
  const callbackUrl = `${baseUrl}/api/auth/callback`;

  // Validate redirect URL
  const allowedUrl = getAllowedRedirectUrl(callbackUrl);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: allowedUrl,
    },
  });

  if (error) {
    logError(error, "googleSignInAction");
    return {
      success: false,
      error: error.message,
      code: "AUTH",
    } as AuthResult;
  }

  if (data.url) {
    redirect(data.url);
  }

  return {
    success: false,
    error: "OAuth initialization failed.",
    code: "SERVER",
  } as AuthResult;
}
