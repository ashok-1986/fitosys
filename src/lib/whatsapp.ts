/**
 * Fitosys - AiSensy WhatsApp API Service
 */

interface AiSensyMessage {
    apiKey: string;
    campaignName: string;
    destination: string;       // client WhatsApp number with country code e.g. "919876543210"
    userName: string;          // your AiSensy account name
    templateParams: string[];  // matches {{1}}, {{2}} etc in template
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
      destination: to,          // must include country code, no + sign: "919876543210"
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

  /**
   * Send a weekly check-in prompt to a client via WhatsApp
   */
  export async function sendWeeklyCheckin(to: string, clientName: string, coachName: string) {
    return sendWhatsAppTemplate(to, "weekly_checkin", [clientName, coachName]);
  }

  /**
   * Send the coach's weekly AI summary via WhatsApp
   */
  export async function sendCoachWeeklySummary(to: string, coachName: string, summaryText: string) {
    return sendWhatsAppTemplate(to, "coach_weekly_summary", [coachName, summaryText]);
  }

  /**
   * Send a welcome message to a newly onboarded client
   */
  export async function sendClientWelcome(to: string, clientName: string, coachName: string) {
    return sendWhatsAppTemplate(to, "client_welcome", [clientName, coachName]);
  }

  /**
   * Notify the coach that a new client has signed up
   */
  export async function sendCoachNewClientNotification(to: string, coachName: string, clientName: string) {
    return sendWhatsAppTemplate(to, "new_client_notification", [coachName, clientName]);
  }
