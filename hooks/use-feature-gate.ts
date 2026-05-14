// hooks/use-feature-gate.ts
import { useDashboard } from './use-dashboard'
import { planHasFeature, Feature, Plan } from '@/lib/plans/config'

export function useFeatureGate() {
  const { data, loading } = useDashboard()
  
  // Default to 'trial' if not loaded or missing
  const plan = (data?.coach?.plan as Plan) || 'trial'

  const hasFeature = (feature: Feature) => {
    // If we're loading, we might want to return true to prevent UI flash,
    // but returning false is strictly safer. However, typically we hide 
    // gated features until loaded or show them blurred.
    if (loading) return true // optimistic to prevent flash, actual enforcement is backend
    return planHasFeature(plan, feature)
  }

  return { plan, hasFeature, loading }
}
