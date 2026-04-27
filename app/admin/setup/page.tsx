import { setupAdminUser } from "@/app/actions/setup-admin";
import { getRlsSql } from "@/app/actions/setup-rls";
import SetupClient from "./_client";

export default async function SetupPage() {
  // Auto-create admin account on page load (idempotent)
  const adminResult = await setupAdminUser();
  const rlsSql = await getRlsSql();

  return <SetupClient adminResult={adminResult} rlsSql={rlsSql} />;
}
