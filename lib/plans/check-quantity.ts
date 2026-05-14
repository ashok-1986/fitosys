// lib/plans/check-quantity.ts
import { createClient } from '@/lib/supabase/server'
import { getPlanLimit, Plan } from './config'

export type QuantityCheckResult = {
  allowed: boolean
  currentCount: number
  limit: number | null
  plan: Plan
  utilisationPct: number
  gracePeriodDaysRemaining: number | null
  upgradeRequired: boolean
}

export async function checkClientQuantity(
  coachId: string
): Promise<QuantityCheckResult> {
  const supabase = await createClient()

  // Get coach plan
  const { data: coach, error } = await supabase
    .from('coaches')
    .select('plan, trial_started_at')
    .eq('id', coachId)
    .single()

  if (error || !coach) throw new Error('Coach not found')

  const plan = coach.plan as Plan
  const limit = getPlanLimit(plan)

  // Count active clients
  const { count } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('coach_id', coachId)
    .eq('status', 'active')

  const currentCount = count ?? 0

  // Unlimited plan
  if (limit === null) {
    return {
      allowed: true,
      currentCount,
      limit: null,
      plan,
      utilisationPct: 0,
      gracePeriodDaysRemaining: null,
      upgradeRequired: false,
    }
  }

  const utilisationPct = Math.round((currentCount / limit) * 100)
  const overLimit = currentCount >= limit

  // Grace period: 7 days from when limit was first hit
  let gracePeriodDaysRemaining: number | null = null
  if (overLimit) {
    const { data: gracePeriodRecord } = await supabase
      .from('plan_grace_periods')
      .select('limit_hit_at')
      .eq('coach_id', coachId)
      .eq('plan', plan)
      .single()

    if (!gracePeriodRecord) {
      // First time hitting limit — record it
      await supabase.from('plan_grace_periods').upsert({
        coach_id: coachId,
        plan,
        limit_hit_at: new Date().toISOString(),
      })
      gracePeriodDaysRemaining = 7
    } else {
      const hitAt = new Date(gracePeriodRecord.limit_hit_at)
      const now = new Date()
      const daysPassed = Math.floor(
        (now.getTime() - hitAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      gracePeriodDaysRemaining = Math.max(0, 7 - daysPassed)
    }
  }

  const allowed = !overLimit || 
    (gracePeriodDaysRemaining !== null && gracePeriodDaysRemaining > 0)

  return {
    allowed,
    currentCount,
    limit,
    plan,
    utilisationPct,
    gracePeriodDaysRemaining,
    upgradeRequired: !allowed,
  }
}
