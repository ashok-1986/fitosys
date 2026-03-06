import React from "react";
import ClientListView from "./client-list-view";
import { getCurrentCoachId, getEnrichedClients } from "@/lib/api-services";

export default async function Page() {
  const coachId = await getCurrentCoachId();
  const clients = await getEnrichedClients(coachId);

  return <ClientListView initialClients={clients} />;
}
