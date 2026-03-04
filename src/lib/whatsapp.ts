// ─── WhatsApp Integration Layer ───
// Stubbed for MVP — plug in Interakt (India) or WATI (Global) API later.
// All message templates match PRD Section 5.

interface SendMessageParams {
    to: string; // phone with country code, e.g. "+919876543210"
    message: string;
}

async function sendMessage({ to, message }: SendMessageParams): Promise<void> {
    // TODO: Replace with real Interakt/WATI API call
    console.log(`[WhatsApp] → ${to}`);
    console.log(message);
    console.log("---");
}

// ─── Message Templates ───

export async function sendClientWelcome(params: {
    clientName: string;
    coachName: string;
    programName: string;
    endDate: string;
    checkinDay: string;
    clientPhone: string;
}) {
    const message = `Hi ${params.clientName} 👋

Welcome to ${params.coachName}'s coaching program!

Your ${params.programName} program starts today and runs until ${params.endDate}.

Here's what to expect:
• Every ${params.checkinDay} evening, I'll send you a quick 4-question check-in on WhatsApp
• Just reply here, it takes 2 minutes
• I'll review your responses and flag anything that needs attention

Talk soon,
${params.coachName}`;

    await sendMessage({ to: params.clientPhone, message });
}

export async function sendCoachNewClientNotification(params: {
    coachPhone: string;
    clientName: string;
    programName: string;
    currency: string;
    amount: number;
    startDate: string;
    endDate: string;
}) {
    const message = `💰 New client onboarded

Name: ${params.clientName}
Program: ${params.programName}
Amount: ${params.currency}${params.amount}
Program dates: ${params.startDate} to ${params.endDate}

They're now in your Active Clients list.`;

    await sendMessage({ to: params.coachPhone, message });
}

export async function sendWeeklyCheckin(params: {
    clientName: string;
    coachName: string;
    clientPhone: string;
}) {
    const message = `Hey ${params.clientName} 👋

Quick weekly check-in from ${params.coachName}.
Takes 2 minutes, reply right here.

1️⃣ Weight this week? (e.g., 73.2 kg)
2️⃣ Sessions completed this week? (e.g., 3)
3️⃣ Energy level 1 to 10? (1 = exhausted, 10 = amazing)
4️⃣ Any wins or struggles this week?

Just reply in one message or separate messages, whatever is easier.`;

    await sendMessage({ to: params.clientPhone, message });
}

export async function sendRenewalReminder(params: {
    clientName: string;
    coachName: string;
    programName: string;
    endDate: string;
    sessionsCompleted: number;
    weeksCompleted: number;
    weightProgress: string | null;
    paymentLink: string;
    clientPhone: string;
}) {
    const weightLine = params.weightProgress
        ? `📉 ${params.weightProgress} progress tracked\n`
        : "";
    const message = `Hey ${params.clientName} 👋

Your ${params.programName} with ${params.coachName} ends on ${params.endDate}.

Here's a quick look at your journey:
📊 ${params.sessionsCompleted} sessions completed
${weightLine}✅ ${params.weeksCompleted} weeks of check-ins completed

Ready to keep the momentum going?

Renew your program here:
${params.paymentLink}

Questions? Just reply here.

${params.coachName}`;

    await sendMessage({ to: params.clientPhone, message });
}

export async function sendSecondRenewalReminder(params: {
    clientName: string;
    coachName: string;
    daysRemaining: number;
    paymentLink: string;
    clientPhone: string;
}) {
    const message = `Hi ${params.clientName}, just a quick reminder that your program ends in ${params.daysRemaining} days.

Renewing takes 2 minutes:
${params.paymentLink}

If you are taking a break, no problem — just let me know so I can keep your spot open.

${params.coachName}`;

    await sendMessage({ to: params.clientPhone, message });
}

export async function sendCoachWeeklySummary(params: {
    coachName: string;
    coachPhone: string;
    summaryText: string;
    dashboardLink: string;
}) {
    const message = `Good morning ${params.coachName} 👋

Your weekly coaching pulse is ready.

${params.summaryText}

View full details in your dashboard: ${params.dashboardLink}`;

    await sendMessage({ to: params.coachPhone, message });
}

export async function sendCoachRenewalNotification(params: {
    coachPhone: string;
    clientName: string;
    programName: string;
    newEndDate: string;
    currency: string;
    amount: number;
}) {
    const message = `${params.clientName} renewed ${params.programName} until ${params.newEndDate}. ${params.currency}${params.amount} received.`;

    await sendMessage({ to: params.coachPhone, message });
}
