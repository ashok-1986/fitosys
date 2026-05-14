"use client";

import { ReactNode } from 'react'
import { useFeatureGate } from '@/hooks/use-feature-gate'
import { Feature, FEATURE_UNLOCK_PLAN, FEATURE_LABELS } from '@/lib/plans/config'
import { Lock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type FeatureGateProps = {
  feature: Feature
  children: ReactNode
  mode?: 'hide' | 'blur' | 'banner'
}

export function FeatureGate({ feature, children, mode = 'hide' }: FeatureGateProps) {
  const { hasFeature, loading } = useFeatureGate()
  
  if (loading) {
    if (mode === 'hide') return null
    return <div className="opacity-50 pointer-events-none">{children}</div>
  }

  if (hasFeature(feature)) return <>{children}</>

  const requiredPlan = FEATURE_UNLOCK_PLAN[feature]
  const featureLabel = FEATURE_LABELS[feature]

  if (mode === 'hide') return null

  const UpgradePrompt = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-sm z-10 rounded-lg border border-white/10">
      <div className="bg-red-500/20 p-3 rounded-full mb-4">
        <Lock className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2 capitalize">Upgrade to {requiredPlan}</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-sm">
        {featureLabel} is only available on the {requiredPlan} plan and above.
      </p>
      <Link href="/dashboard/settings?tab=billing" passHref legacyBehavior>
        <Button variant="default" className="bg-white text-black hover:bg-gray-200">
          View Plans
        </Button>
      </Link>
    </div>
  )

  if (mode === 'blur') {
    return (
      <div className="relative overflow-hidden group">
        <div className="opacity-20 blur-sm pointer-events-none select-none transition-all">
          {children}
        </div>
        <UpgradePrompt />
      </div>
    )
  }

  if (mode === 'banner') {
    return (
      <div className="w-full">
        <div className="p-4 mb-6 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-sm font-medium text-white">{featureLabel} Locked</p>
              <p className="text-xs text-red-300 capitalize">Requires {requiredPlan} plan</p>
            </div>
          </div>
          <Link href="/dashboard/settings?tab=billing" passHref legacyBehavior>
            <Button size="sm" variant="outline" className="border-red-500/20 hover:bg-red-500/10">
              Upgrade
            </Button>
          </Link>
        </div>
        <div className="opacity-50 pointer-events-none grayscale">
          {children}
        </div>
      </div>
    )
  }

  return null
}
