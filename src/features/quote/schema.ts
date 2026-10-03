import { z } from "zod";

/**
 * Lead / quote request schema — shared by the client form and the API route.
 * Add fields here as the questionnaire grows (project type, budget, timeline,
 * photo uploads, preferred appointment slot…), then reference them in steps.ts.
 */
export const quoteSchema = z.object({
  fullName: z.string().trim().min(1, { error: "Enter your full name." }),
  email: z
    .string()
    .trim()
    .min(1, { error: "Enter your email address." })
    .pipe(z.email({ error: "Enter a valid email address, like name@example.com." })),
  phone: z
    .string()
    .trim()
    .min(1, { error: "Enter your phone number." })
    .regex(/^[0-9+()\-.\s]{7,}$/, { error: "Enter a valid phone number, like (555) 123-4567." }),
  location: z.string().trim().min(1, { error: "Enter the city or town where the project is." }),
  details: z.string().trim().max(2000, { error: "Keep project details under 2,000 characters." }).optional(),
  /** Honeypot — must stay empty. Hidden from people, filled by bots. */
  website: z.string().optional(),
});

export type QuoteInput = z.input<typeof quoteSchema>;
export type QuoteRequest = z.output<typeof quoteSchema>;
