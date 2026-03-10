import React from "react";
import ClientListView from "./client-list-view";
import { getCurrentCoachId, getEnrichedClients, getCoachClientStats } from "@/lib/api-services";

export default async function Page() {
  const coachId = await getCurrentCoachId();
  
  const [clients, stats] = await Promise.all([
    getEnrichedClients(coachId),
    getCoachClientStats(coachId)
  ]);

  return <ClientListView initialClients={clients} stats={stats} />;
}
