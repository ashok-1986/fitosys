// lib/plans/check-feature.ts
import { createClient } from '@/lib/supabase/server'
import { planHasFeature, Feature, Plan, FEATURE_UNLOCK_PLAN } from './config'

export type FeatureCheckResult = {
  allowed: boolean
  feature: Feature
  coachPlan: Plan
  requiredPlan: Plan
}

export async function checkFeatureAccess(
  coachId: string,
  feature: Feature
): Promise<FeatureCheckResult> {
  const supabase = await createClient()

  const { data: coach, error } = await supabase
    .from('coaches')
    .select('plan')
    .eq('id', coachId)
    .single()

  if (error || !coach) throw new Error('Coach not found')

  const coachPlan = coach.plan as Plan
  const allowed = planHasFeature(coachPlan, feature)
  const requiredPlan = FEATURE_UNLOCK_PLAN[feature]

  return { allowed, feature, coachPlan, requiredPlan }
}

/** 
 * Use in API routes — throws 403 response if not allowed.
 * Import and call at the top of any gated route handler.
 */
export async function requireFeature(
  coachId: string,
  feature: Feature
): Promise<void> {
  const result = await checkFeatureAccess(coachId, feature)
  if (!result.allowed) {
    throw new Response(
      JSON.stringify({
        error: 'FEATURE_NOT_AVAILABLE',
        feature: result.feature,
        coachPlan: result.coachPlan,
        requiredPlan: result.requiredPlan,
        message: `This feature requires the ${result.requiredPlan} plan or above.`,
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
