import { createClient } from "@supabase/supabase-js";
import { encryptPhone } from "../lib/crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching clients...");
  const { data: clients } = await supabase.from("clients").select("id, whatsapp_number");
  if (clients) {
    for (const client of clients) {
      if (client.whatsapp_number && !client.whatsapp_number.includes("==")) {
        console.log(`Encrypting client ${client.id}`);
        await supabase.from("clients").update({
          whatsapp_number: encryptPhone(client.whatsapp_number)
        }).eq("id", client.id);
      }
    }
  }

  console.log("Fetching coaches...");
  const { data: coaches } = await supabase.from("coaches").select("id, whatsapp_number");
  if (coaches) {
    for (const coach of coaches) {
      if (coach.whatsapp_number && !coach.whatsapp_number.includes("==")) {
        console.log(`Encrypting coach ${coach.id}`);
        await supabase.from("coaches").update({
          whatsapp_number: encryptPhone(coach.whatsapp_number)
        }).eq("id", coach.id);
      }
    }
  }

  console.log("Migration complete.");
}

run();
