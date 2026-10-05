import { uploadRequestSchema } from "@/features/estimate/schema";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdmin, UPLOAD_BUCKET } from "@/lib/supabase/server";

/** Make a filename safe for a storage key (matches UPLOAD_PATH in schema.ts). */
const safeName = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-100) || "file";

/**
 * POST /api/estimates/uploads
 * Issues short-lived signed upload URLs so the browser uploads straight to
 * Supabase Storage (large photos never pass through this server).
 * Type and size are checked here and again by the bucket's own limits.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "Photo uploads aren't available yet." }, { status: 503 });
  }

  const parsed = uploadRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid upload request." }, { status: 400 });
  }

  const { uploadSessionId, files } = parsed.data;
  const storage = getSupabaseAdmin().storage.from(UPLOAD_BUCKET);

  try {
    const uploads = await Promise.all(
      files.map(async (file) => {
        const path = `requests/${uploadSessionId}/${crypto.randomUUID()}-${safeName(file.name)}`;
        const { data, error } = await storage.createSignedUploadUrl(path);
        if (error) throw error;
        return { path: data.path, token: data.token };
      }),
    );
    return Response.json({ uploads });
  } catch (err) {
    console.error("[uploads] could not create signed upload URLs", err);
    return Response.json({ error: "We couldn't prepare your upload. Please try again." }, { status: 502 });
  }
}
