/**
 * Fitosys WhatsApp Template Functions
 * ------------------------------------
 * All template names, variable orders, and body text match
 * Meta-approved templates exactly as of Mar 10, 2026.
 *
 * Provider: Meta WhatsApp Cloud API (direct)
 * Phone Number ID: 838337922704261
 * Base URL: https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages
 *
 * WARNING: Do not change variable order or template names without
 * first updating the approved template in Meta Business Manager.
 * Mismatch will cause API error code 132000 at send time.
 */

const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;
const META_API_VERSION = "v19.0";

const META_API_URL = `https://graph.facebook.com/${META_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MetaTemplateComponent {
  type: "body";
  parameters: Array<{
    type: "text";
    text: string;
  }>;
}

interface MetaTemplatePayload {
  messaging_product: "whatsapp";
  to: string;
  type: "template";
  template: {
    name: string;
    language: {
      code: string;
    };
    components: MetaTemplateComponent[];
  };
}

export interface WhatsAppSendResult {
  success: boolean;
  templateName: string;
  recipient: string;
  messageId?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Core send function
// ---------------------------------------------------------------------------

async function sendTemplate(
  phone: string,
  templateName: string,
  bodyValues: string[]
): Promise<WhatsAppSendResult> {
  // Normalize to E.164 without + sign
  // Meta Cloud API expects: 919876543210 (no + prefix)
  const normalizedPhone = phone.replace(/\s+/g, "").replace(/^\+/, "");

  const payload: MetaTemplatePayload = {
    messaging_product: "whatsapp",
    to: normalizedPhone,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: bodyValues.map((value) => ({
            type: "text",
            text: value,
          })),
        },
      ],
    },
  };

  try {
    const response = await fetch(META_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(
        `[WhatsApp] Failed to send ${templateName} to ${phone}:`,
        JSON.stringify(responseData)
      );
      return {
        success: false,
        templateName,
        recipient: phone,
        error: responseData?.error?.message ?? "Unknown error",
      };
    }

    const messageId = responseData?.messages?.[0]?.id;
    console.log(
      `[WhatsApp] Sent ${templateName} to ${phone} — message ID: ${messageId}`
    );

    return {
      success: true,
      templateName,
      recipient: phone,
      messageId,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[WhatsApp] Exception sending ${templateName}:`, message);
    return {
      success: false,
      templateName,
      recipient: phone,
      error: message,
    };
  }
}

// ---------------------------------------------------------------------------
// Template 1: fitosys_weekly_checkin
// ---------------------------------------------------------------------------
// Approved body:
// Hi {{1}}, it's your weekly check-in with Coach {{2}} 💪
// Quick check-in — reply with your answers:
// 1️⃣ Energy this week (1–10)?
// 2️⃣ Sessions completed?
// 3️⃣ One win this week?
// 4️⃣ Anything challenging you?
// Takes 60 seconds. Your coach reads every reply.
// ---------------------------------------------------------------------------

export async function sendWeeklyCheckin(
  clientPhone: string,
  clientName: string,
  coachName: string
): Promise<WhatsAppSendResult> {
  return sendTemplate(clientPhone, "fitosys_weekly_checkin", [
    clientName,
    coachName,
  ]);
}

// ---------------------------------------------------------------------------
// Template 2: fitosys_client_welcome
// ---------------------------------------------------------------------------
// Approved body:
// Welcome to Coach {{1}}'s program, {{2}}! 🎉
// You're enrolled in: *{{3}}*
// Program starts: {{4}}
// Every Sunday at 7 PM you'll receive a weekly check-in from this number.
// Just reply naturally — your coach reads every response.
// Questions? Reply anytime.
// ---------------------------------------------------------------------------

export async function sendClientWelcome(
  clientPhone: string,
  coachName: string,
  clientName: string,
  programName: string,
  programStartDate: string
): Promise<WhatsAppSendResult> {
  return sendTemplate(clientPhone, "fitosys_client_welcome", [
    coachName,
    clientName,
    programName,
    programStartDate,
  ]);
}

// ---------------------------------------------------------------------------
// Template 3: fitosys_renewal_reminder
// ---------------------------------------------------------------------------
// Approved body:
// Hi {{1}} 👋
// Your *{{2}}* program with Coach {{3}} ends in *{{4}} days*.
// Your progress this program:
// ⚡ Avg energy: {{5}}/10
// 🏋️ Sessions completed: {{6}}
// Ready to keep going? Renew here:
// {{7}}
// Reply STOP to opt out.
// ---------------------------------------------------------------------------

export async function sendRenewalReminder(
  clientPhone: string,
  clientName: string,
  programName: string,
  coachName: string,
  daysLeft: number,
  avgEnergy: number,
  sessionsCompleted: number,
  renewalLink: string
): Promise<WhatsAppSendResult> {
  return sendTemplate(clientPhone, "fitosys_renewal_reminder", [
    clientName,
    programName,
    coachName,
    String(daysLeft),
    String(avgEnergy),
    String(sessionsCompleted),
    renewalLink,
  ]);
}

// ---------------------------------------------------------------------------
// Template 4: fitosys_second_renewal_reminder
// ---------------------------------------------------------------------------
// Approved body:
// Hi {{1}}, your {{2}} program with Coach {{3}} is ending in {{4}} days.
// Your coach has been notified. This is an automated reminder.
// ---------------------------------------------------------------------------

export async function sendSecondRenewalReminder(
  clientPhone: string,
  clientName: string,
  programName: string,
  coachName: string,
  daysLeft: number
): Promise<WhatsAppSendResult> {
  return sendTemplate(clientPhone, "fitosys_second_renewal_reminder", [
    clientName,
    programName,
    coachName,
    String(daysLeft),
  ]);
}

// ---------------------------------------------------------------------------
// Template 5: fitosys_coach_weekly_summary
// ---------------------------------------------------------------------------
// Approved body:
// Hello {{1}}, your Fitosys weekly summary for the week of {{2}} is now
// available. Client overview: {{3}}. This is an automated report.
// ---------------------------------------------------------------------------

export async function sendCoachWeeklySummary(
  coachPhone: string,
  coachName: string,
  weekLabel: string,
  summaryText: string
): Promise<WhatsAppSendResult> {
  return sendTemplate(coachPhone, "fitosys_coach_weekly_summary", [
    coachName,
    weekLabel,
    summaryText,
  ]);
}

// ---------------------------------------------------------------------------
// Template 6: fitosys_new_client_notification
// ---------------------------------------------------------------------------
// Approved body:
// Hello {{1}}, a new client has joined your Fitosys program. {{2}} has
// completed their intake form and is ready to begin. This is an automated
// notification.
// ---------------------------------------------------------------------------

export async function sendCoachNewClientNotification(
  coachPhone: string,
  coachName: string,
  clientName: string
): Promise<WhatsAppSendResult> {
  return sendTemplate(coachPhone, "fitosys_new_client_notification", [
    coachName,
    clientName,
  ]);
}
