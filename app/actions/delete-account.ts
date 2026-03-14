"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { logEvent, logError } from "@/lib/loggerHelpers";
import { getAuthenticatedCoach } from "@/lib/auth";

export type DeleteAccountResult =
  | { success: true; message: string }
  | { success: false; error: string; code: "UNAUTHORIZED" | "VALIDATION" | "SERVER" };

/**
 * DELETE /api/coaches/account — Soft delete coach account
 * Implements DPDP 2023 "Right to Erasure" compliance
 */
export async function deleteAccountAction(formData: FormData): Promise<DeleteAccountResult> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  
  // 1. Authenticate user
  const { coachId, supabase, error: authError } = await getAuthenticatedCoach();
  if (authError) {
    return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };
  }

  // 2. Validate confirmation
  const confirmEmail = formData.get("confirmEmail") as string;
  const { data: coach } = await supabase!
    .from("coaches")
    .select("email")
    .eq("id", coachId!)
    .single();

  if (!coach || confirmEmail !== coach.email) {
    logEvent("account.delete.validation_failed", { ip, coachId });
    return { 
      success: false, 
      error: "Email confirmation does not match", 
      code: "VALIDATION" 
    };
  }

  // 3. Soft delete using database function (DPDP 2023 compliant)
  try {
    // Call the database function to schedule deletion (sets 30-day grace period)
    const { error: rpcError } = await supabase!.rpc("schedule_account_deletion", {
      coach_uuid: coachId!
    });

    if (rpcError) {
      logError(rpcError, "deleteAccountAction");
      return { success: false, error: "Failed to delete account", code: "SERVER" };
    }

    // 4. Log the deletion event
    logEvent("account.delete.requested", { 
      ip, 
      coachId,
      email: coach.email,
      scheduled_for: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // 5. Sign out user
    await supabase.auth.signOut();

    return { 
      success: true, 
      message: "Account deletion scheduled. You have 30 days to change your mind. Contact support to cancel." 
    };

  } catch (err) {
    logError(err, "deleteAccountAction");
    return { success: false, error: "Account deletion failed", code: "SERVER" };
  }
}

/**
 * Cancel pending account deletion
 */
export async function cancelDeletionAction(): Promise<DeleteAccountResult> {
  const { coachId, supabase, error: authError } = await getAuthenticatedCoach();
  if (authError) {
    return { success: false, error: "Unauthorized", code: "UNAUTHORIZED" };
  }

  try {
    // Call the database function to cancel deletion
    const { data: success, error: rpcError } = await supabase!.rpc("cancel_account_deletion", {
      coach_uuid: coachId!
    });

    if (rpcError || !success) {
      return { success: false, error: "Failed to cancel deletion", code: "SERVER" };
    }

    logEvent("account.delete.cancelled", { coachId });

    return { success: true, message: "Account deletion cancelled. Your account is active." };

  } catch (err) {
    logError(err, "cancelDeletionAction");
    return { success: false, error: "Failed to cancel deletion", code: "SERVER" };
  }
}
