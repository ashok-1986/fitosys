import { createClient } from "@/lib/supabase/server";

export async function generateUniqueSlug(fullName: string): Promise<string> {
  const supabase = await createClient();

  const base = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);

  let slug = base;
  let attempt = 0;

  while (true) {
    const { data } = await supabase
      .from("coaches")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug; // slug is free

    attempt++;
    slug = `${base}-${attempt}`; // priya-sharma-1, priya-sharma-2, etc.

    if (attempt > 10) {
      // Fallback: append timestamp suffix
      slug = `${base}-${Date.now().toString(36)}`;
      return slug;
    }
  }
}
