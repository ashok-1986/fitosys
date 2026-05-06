export function isTrialExpired(coach: any): boolean {
    if (!coach || coach.plan !== 'trial' || !coach.trial_expires_at) return false;
    const expiresAt = new Date(coach.trial_expires_at);
    return expiresAt.getTime() < Date.now();
}

export function getTrialDaysRemaining(coach: any): number {
    if (!coach || coach.plan !== 'trial' || !coach.trial_expires_at) return 0;
    const expiresAt = new Date(coach.trial_expires_at);
    const diffTime = expiresAt.getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
}

export function getTrialStatus(coach: any): 'active' | 'expired' | 'converted' {
    if (!coach) return 'expired';
    if (coach.plan !== 'trial') return 'converted';
    return isTrialExpired(coach) ? 'expired' : 'active';
}
