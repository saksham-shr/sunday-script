"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { readFile } from "fs/promises";
import path from "path";

export type RlsResult =
  | { status: "success"; message: string }
  | { status: "no_key"; message: string }
  | { status: "error"; message: string };

export async function getRlsSql(): Promise<string> {
  const sqlPath = path.join(process.cwd(), "supabase", "migrations", "001_enable_rls.sql");
  try {
    return await readFile(sqlPath, "utf-8");
  } catch {
    return "";
  }
}

export async function checkRlsStatus(): Promise<
  { table: string; rls_enabled: boolean }[]
> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("check_rls_status");
    if (error || !data) return [];
    return data as { table: string; rls_enabled: boolean }[];
  } catch {
    return [];
  }
}
