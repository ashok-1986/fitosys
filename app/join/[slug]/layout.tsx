import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: coach } = await supabase
        .from('coaches')
        .select('full_name')
        .eq('slug', slug)
        .single();
        
    const coachName = coach?.full_name || 'Your Coach';
    
    return {
        title: `Join ${coachName} | Fitosys`,
        description: `Enroll in ${coachName}'s coaching program. Fill out your intake form and get started on your fitness journey.`,
    };
}

export default function JoinLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
