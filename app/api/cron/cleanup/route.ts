import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

// Called daily by Vercel Cron (configure in vercel.json).
// Deletes collaborator posts that have been in 'review' or 'revisions'
// status for more than 30 days without being approved.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await admin
    .from("posts")
    .delete()
    .in("status", ["review", "revisions"])
    .lt("updated_at", cutoff)
    .select("id, title");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: data?.length ?? 0, posts: data });
}
