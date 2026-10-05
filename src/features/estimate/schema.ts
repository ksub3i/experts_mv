import { z } from "zod";
import {
  AREAS,
  BUDGETS,
  FILE_CATEGORIES,
  RENOVATION_TYPES,
  TIMELINES,
  UPLOAD_LIMITS,
  WORK_TYPES,
  values,
} from "./options";

/**
 * Estimate request validation, shared by the questionnaire (per step) and the
 * API route (whole request). Field names match the database payload in
 * supabase/migrations/*_initial_schema.sql → submit_quote_request().
 */

const pick = (message: string) => ({ error: message });

/** Storage path issued by /api/estimates/uploads: requests/<session>/<uuid>-<name> */
export const UPLOAD_PATH = /^requests\/[0-9a-f-]{36}\/[0-9a-f-]{36}-[\w.-]{1,120}$/;

export const uploadedFileSchema = z.object({
  path: z.string().regex(UPLOAD_PATH),
  name: z.string().min(1).max(200),
  category: z.enum(values(FILE_CATEGORIES)),
  contentType: z.string().max(100),
  size: z.number().int().positive().max(UPLOAD_LIMITS.maxBytes),
});
export type UploadedFile = z.infer<typeof uploadedFileSchema>;

const fields = {
  renovationType: z.enum(values(RENOVATION_TYPES), pick("Choose what you're looking to renovate.")),
  workTypes: z.array(z.string().max(60)).max(12),
  workTypeOther: z.string().trim().max(300).optional(),
  budget: z.enum(values(BUDGETS), pick("Choose an approximate budget.")),
  area: z.enum(values(AREAS), pick("Choose where the property is.")),
  address: z
    .string()
    .trim()
    .min(3, pick("Enter the property address, e.g. building name and road."))
    .max(300),
  postcode: z
    .string()
    .trim()
    .max(10)
    .regex(/^(\d{5})?$/, pick("Postcodes in the Maldives are 5 digits, e.g. 20014."))
    .optional(),
  timeline: z.enum(values(TIMELINES), pick("Choose when you'd like to start.")),
  description: z
    .string()
    .trim()
    .min(20, pick("Tell us a little more — at least a sentence or two (20+ characters)."))
    .max(4000, pick("Keep the description under 4,000 characters.")),
  files: z.array(uploadedFileSchema).max(UPLOAD_LIMITS.maxFiles),
  fullName: z.string().trim().min(2, pick("Enter your full name.")).max(120),
  phone: z
    .string()
    .trim()
    .min(1, pick("Enter your phone number."))
    .regex(/^\+?[0-9()\-.\s]{7,20}$/, pick("Enter a valid phone number, e.g. +960 777 1234.")),
  email: z
    .string()
    .trim()
    .min(1, pick("Enter your email address."))
    .pipe(z.email(pick("Enter a valid email address, like name@example.com."))),
  uploadSessionId: z.uuid(),
  /** Honeypot — hidden from people, filled by bots. */
  website: z.string().optional(),
};

/** Step 2 depends on Step 1: valid work types differ per renovation type. */
function checkWorkTypes(
  data: { renovationType: string; workTypes: string[]; workTypeOther?: string },
  ctx: z.RefinementCtx,
) {
  if (data.renovationType === "other") {
    if (!data.workTypeOther || data.workTypeOther.length < 3) {
      ctx.addIssue({ code: "custom", path: ["workTypeOther"], message: "Briefly describe the type of work." });
    }
    return;
  }
  const allowed = WORK_TYPES[data.renovationType as keyof typeof WORK_TYPES]?.map((w) => w.value) ?? [];
  if (data.workTypes.length === 0) {
    ctx.addIssue({ code: "custom", path: ["workTypes"], message: "Choose at least one type of work." });
  } else if (data.workTypes.some((w) => !allowed.includes(w))) {
    ctx.addIssue({ code: "custom", path: ["workTypes"], message: "Choose from the listed types of work." });
  }
}

/** One schema per questionnaire step (Steps 1–8), validated before moving on. */
export const stepSchemas = [
  z.object({ renovationType: fields.renovationType }),
  z
    .object({ renovationType: fields.renovationType, workTypes: fields.workTypes, workTypeOther: fields.workTypeOther })
    .superRefine(checkWorkTypes),
  z.object({ budget: fields.budget }),
  z.object({ area: fields.area, address: fields.address, postcode: fields.postcode }),
  z.object({ timeline: fields.timeline }),
  z.object({ description: fields.description }),
  z.object({ files: fields.files }),
  z.object({ fullName: fields.fullName, phone: fields.phone, email: fields.email }),
] as const;

/** Full request, validated again on the server. */
export const estimateSchema = z.object(fields).superRefine(checkWorkTypes);

export type EstimateInput = z.input<typeof estimateSchema>;
export type EstimateRequest = z.output<typeof estimateSchema>;

/** Body of POST /api/estimates/uploads — asks for signed upload URLs. */
export const uploadRequestSchema = z.object({
  uploadSessionId: z.uuid(),
  files: z
    .array(
      z.object({
        name: z.string().min(1).max(200),
        type: z.string().refine((t) => UPLOAD_LIMITS.mimeTypes.includes(t), "Only JPG, PNG, WEBP, HEIC or PDF files."),
        size: z.number().int().positive().max(UPLOAD_LIMITS.maxBytes, "Each file must be 15 MB or smaller."),
      }),
    )
    .min(1)
    .max(UPLOAD_LIMITS.maxFiles),
});
