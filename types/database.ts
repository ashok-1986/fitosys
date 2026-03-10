// ─── Fitosys Database Types ───
// These mirror the Supabase/PostgreSQL schema from PRD Section 7.1

export interface Coach {
    id: string;
    email: string;
    full_name: string;
    whatsapp_number: string;
    country_code: string;
    timezone: string;
    coaching_type: string[];
    gateway_customer_id: string | null;
    gateway_account_id: string | null;
    plan: "trial" | "basic" | "pro";
    checkin_day: number; // 0=Sunday ... 6=Saturday
    checkin_time: string; // "19:00"
    slug: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface Program {
    id: string;
    coach_id: string;
    name: string;
    description: string | null;
    duration_weeks: number;
    price: number;
    currency: string;
    checkin_type: "fitness" | "yoga" | "wellness" | "custom";
    is_active: boolean;
    created_at: string;
}

export interface Client {
    id: string;
    coach_id: string;
    full_name: string;
    whatsapp_number: string;
    email: string;
    age: number | null;
    primary_goal: string | null;
    health_notes: string | null;
    gateway_customer_id: string | null;
    status: "active" | "inactive" | "trial";
    created_at: string;
}

export interface Enrollment {
    id: string;
    coach_id: string;
    client_id: string | null;
    program_id: string;
    start_date: string;
    end_date: string;
    amount_paid: number;
    currency: string;
    gateway_payment_id: string | null;
    payment_gateway: string | null;
    status: "active" | "expired" | "renewed" | "cancelled" | "pending" | "payment_failed";
    renewal_reminder_1_sent: boolean;
    renewal_reminder_2_sent: boolean;
    churn_reason: string | null;
    created_at: string;
    // Joined fields
    client?: Client;
    program?: Program;
}

export interface CheckIn {
    id: string;
    coach_id: string;
    client_id: string;
    enrollment_id: string | null;
    week_number: number;
    check_date: string;
    raw_reply: string | null;
    weight_kg: number | null;
    sessions_completed: number | null;
    energy_score: number | null; // 1-10
    notes: string | null;
    responded_at: string | null;
    message_sent_at: string | null;
    created_at: string;
    // Joined
    client?: Client;
}

export interface AISummary {
    id: string;
    coach_id: string;
    week_start_date: string;
    week_end_date: string;
    summary_text: string;
    total_clients: number;
    responded_count: number;
    avg_energy_score: number | null;
    generated_at: string;
    delivered_to_coach: boolean;
}

export interface Payment {
    id: string;
    coach_id: string;
    client_id: string;
    enrollment_id: string | null;
    amount: number;
    currency: string;
    payment_type: "new" | "renewal";
    gateway_payment_id: string | null;
    gateway_order_id: string | null;
    gateway_payment_status: string | null;
    payment_gateway: string | null;
    paid_at: string | null;
    created_at: string;
    // Joined
    client?: Client;
    program_name?: string;
}

export interface WhatsAppMessage {
    id: string;
    coach_id: string | null;
    client_id: string | null;
    direction: "outbound" | "inbound";
    message_type:
    | "checkin"
    | "renewal"
    | "welcome"
    | "coach_notification"
    | "summary";
    message_content: string | null;
    whatsapp_message_id: string | null;
    status: "sent" | "delivered" | "read" | "failed";
    sent_at: string;
}

// ─── Dashboard Payload ───

export interface DashboardData {
    active_clients: number;
    revenue_this_month: number;
    currency: string;
    renewals_due_this_week: number;
    checkin_response_rate_last_week: number;
    clients_needing_attention: {
        id: string;
        name: string;
        reason: string;
        last_energy_score: number | null;
    }[];
    last_summary_preview: string | null;
    renewals: {
        client_name: string;
        client_id: string;
        program: string;
        end_date: string;
        days_remaining: number;
    }[];
}

// ─── Intake Form ───

export interface IntakeFormData {
    full_name: string;
    whatsapp_number: string;
    email: string;
    age: number;
    primary_goal: string;
    health_notes?: string;
    program_id: string;
    agree_terms: boolean;
}
