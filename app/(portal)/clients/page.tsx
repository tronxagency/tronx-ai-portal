import { getClients } from "@/lib/store";
import { ClientsClient } from "./ClientsClient";

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientsClient initial={clients} />;
}
