import { createClient as createBrowserClient } from './supabase/client';

/**
 * Client-side version of getCurrentCoachId - use this ONLY in client components.
 */
export async function getCurrentCoachIdClient(): Promise<string> {
    const supabase = createBrowserClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.error('[getCurrentCoachIdClient] Authentication error:', error);
        throw new Error('Unauthorized: No authenticated user');
    }

    return user.id;
}
