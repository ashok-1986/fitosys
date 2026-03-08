/**
 * Fitosys - AiSensy WhatsApp API Service
 */

interface AiSensyMessage {
  apiKey: string;
  campaignName: string;
  destination: string;
  userName: string;
  templateParams: string[];
  source?: string;
  media?: object;
  buttons?: object[];
}

export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  params: string[]
) {
  const payload: AiSensyMessage = {
    apiKey: process.env.WHATSAPP_AISENSY_API_KEY || "",
    campaignName: templateName,
    destination: to,
    userName: "Fitosys",
    source: "Fitosys-App",
    templateParams: params,
  };

  try {
    const response = await fetch(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`[WhatsApp] Send failed for ${to}:`, error);
      throw new Error(`WhatsApp send failed: ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error("sendWhatsAppTemplate Error:", error);
    return null;
  }
}

export async function sendWeeklyCheckin(
  to: string,
  clientName: string,
  coachName: string
) {
  return sendWhatsAppTemplate(to, "weekly_checkin", [clientName, coachName]);
}

export async function sendCoachWeeklySummary(
  to: string,
  coachName: string,
  summaryText: string
) {
  return sendWhatsAppTemplate(to, "coach_weekly_summary", [
    coachName,
    summaryText,
  ]);
}

export async function sendClientWelcome(
  to: string,
  clientName: string,
  coachName: string
) {
  return sendWhatsAppTemplate(to, "client_welcome", [clientName, coachName]);
}

export async function sendCoachNewClientNotification(
  to: string,
  coachName: string,
  clientName: string
) {
  return sendWhatsAppTemplate(to, "new_client_notification", [
    coachName,
    clientName,
  ]);
}

export async function sendRenewalReminder(
  to: string,
  clientName: string,
  coachName: string,
  programName: string,
  daysLeft: number
) {
  return sendWhatsAppTemplate(to, "renewal_reminder", [
    clientName,
    coachName,
    programName,
    daysLeft.toString(),
  ]);
}

export async function sendSecondRenewalReminder(
  to: string,
  clientName: string,
  coachName: string,
  programName: string,
  daysLeft: number
) {
  return sendWhatsAppTemplate(to, "second_renewal_reminder", [
    clientName,
    coachName,
    programName,
    daysLeft.toString(),
  ]);
}

export async function sendTextMessage(to: string, text: string) {
  try {
    const response = await fetch(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: process.env.WHATSAPP_AISENSY_API_KEY || "",
          destination: to,
          message: text,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(`[WhatsApp] Text message failed for ${to}:`, error);
      throw new Error(`WhatsApp send failed: ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error("sendTextMessage Error:", error);
    return null;
  }
}
