// lib/plans/config.ts

export type Plan = 'trial' | 'starter' | 'basic' | 'pro' | 'studio'

// ── QUANTITY GATE ──────────────────────────────────────────
export const PLAN_CLIENT_LIMITS: Record<Plan, number | null> = {
  trial:   5,
  starter: 10,
  basic:   25,
  pro:     50,
  studio:  null,  // null = unlimited
}

// ── FEATURE GATE ──────────────────────────────────────────
export const PLAN_FEATURES = {
  // Core — all plans
  whatsapp_checkins:        ['trial','starter','basic','pro','studio'],
  renewal_reminders:        ['trial','starter','basic','pro','studio'],
  gst_invoices:             ['trial','starter','basic','pro','studio'],
  coach_dashboard:          ['trial','starter','basic','pro','studio'],
  razorpay_onboarding:      ['trial','starter','basic','pro','studio'],

  // Basic and above
  ai_monday_summary:        ['basic','pro','studio'],
  ai_risk_scoring:          ['basic','pro','studio'],
  ai_coach_insight:         ['basic','pro','studio'],
  extended_client_history:  ['basic','pro','studio'],

  // Pro and above
  custom_checkin_questions: ['pro','studio'],
  program_checkin_templates:['pro','studio'],
  advanced_renewal_analytics:['pro','studio'],
  churn_reason_export:      ['pro','studio'],
  priority_support_4h:      ['pro','studio'],

  // Studio only
  multi_location:           ['studio'],
  white_label_onboarding:   ['studio'],
  api_access:               ['studio'],
  custom_template_names:    ['studio'],
  priority_support_1h:      ['studio'],
  quarterly_business_review:['studio'],
} as const satisfies Record<string, Plan[]>

export type Feature = keyof typeof PLAN_FEATURES

// ── HELPER FUNCTIONS ───────────────────────────────────────

/** Check if a plan includes a feature */
export function planHasFeature(plan: Plan, feature: Feature): boolean {
  return (PLAN_FEATURES[feature] as Plan[]).includes(plan)
}

/** Check if a plan allows more clients (null = unlimited) */
export function getPlanLimit(plan: Plan): number | null {
  return PLAN_CLIENT_LIMITS[plan]
}

/** Get all features available on a plan */
export function getPlanFeatures(plan: Plan): Feature[] {
  return (Object.keys(PLAN_FEATURES) as Feature[]).filter(
    f => planHasFeature(plan, f)
  )
}

/** Get features a plan does NOT have (for upgrade prompts) */
export function getLockedFeatures(plan: Plan): Feature[] {
  return (Object.keys(PLAN_FEATURES) as Feature[]).filter(
    f => !planHasFeature(plan, f)
  )
}

/** Readable label for each feature (used in UI) */
export const FEATURE_LABELS: Record<Feature, string> = {
  whatsapp_checkins:          'WhatsApp Check-ins',
  renewal_reminders:          'Renewal Reminders',
  gst_invoices:               'GST Invoice Generation',
  coach_dashboard:            'Coach Dashboard',
  razorpay_onboarding:        'Razorpay Payment Onboarding',
  ai_monday_summary:          'AI Monday Summary',
  ai_risk_scoring:            'AI Risk Scoring',
  ai_coach_insight:           'AI Coach Insight',
  extended_client_history:    'Extended Client History',
  custom_checkin_questions:   'Custom Check-in Questions',
  program_checkin_templates:  'Program-Specific Templates',
  advanced_renewal_analytics: 'Advanced Renewal Analytics',
  churn_reason_export:        'Churn Reason Export',
  priority_support_4h:        'Priority WhatsApp Support (4h)',
  multi_location:             'Multi-location Management',
  white_label_onboarding:     'White-label Onboarding Page',
  api_access:                 'API Access',
  custom_template_names:      'Custom WhatsApp Template Names',
  priority_support_1h:        'Priority WhatsApp Support (1h)',
  quarterly_business_review:  'Quarterly Business Review',
}

/** Which plan first unlocks this feature */
export const FEATURE_UNLOCK_PLAN: Record<Feature, Plan> = {
  whatsapp_checkins:          'trial',
  renewal_reminders:          'trial',
  gst_invoices:               'trial',
  coach_dashboard:            'trial',
  razorpay_onboarding:        'trial',
  ai_monday_summary:          'basic',
  ai_risk_scoring:            'basic',
  ai_coach_insight:           'basic',
  extended_client_history:    'basic',
  custom_checkin_questions:   'pro',
  program_checkin_templates:  'pro',
  advanced_renewal_analytics: 'pro',
  churn_reason_export:        'pro',
  priority_support_4h:        'pro',
  multi_location:             'studio',
  white_label_onboarding:     'studio',
  api_access:                 'studio',
  custom_template_names:      'studio',
  priority_support_1h:        'studio',
  quarterly_business_review:  'studio',
}
