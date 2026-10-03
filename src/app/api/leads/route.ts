import { z } from "zod";
import { quoteSchema } from "@/features/quote/schema";
import { getLeadService } from "@/lib/integrations/leads";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the highlighted fields.", issues: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  const { website, ...data } = parsed.data;
  // Honeypot filled → silently accept without storing.
  if (website) return Response.json({ ok: true }, { status: 201 });

  try {
    const { id } = await getLeadService().submit({
      ...data,
      source: "website-quote-form",
      receivedAt: new Date().toISOString(),
    });
    return Response.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error("[lead] submit failed", err);
    return Response.json({ error: "We couldn't send your request. Please try again." }, { status: 502 });
  }
}
