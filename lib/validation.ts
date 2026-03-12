// lib/validation.ts
import { z } from "zod";

// E.164 format — works for India (+91), UK (+44), USA (+1), Canada (+1)
const phoneRegex = /^\+[1-9]\d{6,14}$/;

export const intakeFormSchema = z.object({
  full_name:         z.string().min(2).max(100).trim(),
  whatsapp_number:   z.string().regex(phoneRegex, "Must be in format +91XXXXXXXXXX"),
  email:             z.string().email().max(254).toLowerCase().trim(),
  age:               z.number().int().min(12).max(100),
  primary_goal:      z.enum([
    "weight_loss", "muscle_gain", "flexibility",
    "overall_fitness", "mental_wellness", "spiritual_practice"
  ]),
  health_conditions: z.string().max(1000).optional().or(z.literal("")),
  program_id:        z.string().uuid(),
  terms_accepted:    z.literal(true),          // z.literal not z.boolean().refine()
  consent_health:    z.literal(true),          // separate health data consent
  consent_whatsapp:  z.literal(true),          // separate WhatsApp consent
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

export const signupSchema = z.object({
  full_name:       z.string().min(2).max(100).trim(),
  email:           z.string().email().max(254).toLowerCase().trim(),
  password:        z.string()
                     .min(8)
                     .regex(/[A-Z]/, "Must contain uppercase letter")
                     .regex(/[a-z]/, "Must contain lowercase letter")
                     .regex(/[0-9]/, "Must contain a number"),
  whatsapp_number: z.string().regex(phoneRegex, "Must be in format +CountryCodeNumber"),
  country:         z.string().length(2),          // ISO 3166-1 alpha-2
});

export const programSchema = z.object({
  name:           z.string().min(3).max(100).trim(),
  duration_weeks: z.number().int().min(1).max(52),
  price:          z.number().positive().max(999999),
  currency:       z.enum(["INR", "GBP", "USD", "CAD"]),
  checkin_type:   z.enum(["fitness", "yoga", "wellness", "nutrition"]),
  description:    z.string().max(500).trim().optional(),
});

// Reusable helper — use this in every API route
export function validateRequest<T>(data: unknown, schema: z.ZodSchema<T>) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true as const, data: result.data };
  }
  return {
    success: false as const,
    errors: result.error.flatten().fieldErrors,  // readable per-field errors
  };
}