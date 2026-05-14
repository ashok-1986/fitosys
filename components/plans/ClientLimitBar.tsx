"use client";

import { useDashboard } from '@/hooks/use-dashboard'
import { getPlanLimit, Plan } from '@/lib/plans/config'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ClientLimitBar() {
  const { data, loading } = useDashboard()
  
  if (loading || !data?.coach) return null

  const plan = (data.coach.plan as Plan) || 'trial'
  const limit = getPlanLimit(plan)
  const current = data.stats.active_clients

  if (limit === null) return null // Unlimited

  const percent = Math.min(100, Math.round((current / limit) * 100))
  const isNearLimit = percent >= 80
  const isAtLimit = current >= limit

  return (
    <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded-xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-200">Client Limit</h4>
        <span className={`text-xs font-semibold ${isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-400'}`}>
          {current} / {limit} Active
        </span>
      </div>
      
      <Progress value={percent} className={`h-2 ${isAtLimit ? 'bg-red-900/50' : ''}`} />
      
      {isAtLimit && (
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-xs text-red-400">
            You've reached your plan's client limit. New clients cannot check in until you upgrade or free up space.
          </p>
          <Link href="/dashboard/settings?tab=billing" passHref legacyBehavior>
            <Button size="sm" className="w-full bg-red-500 hover:bg-red-600 text-white border-0">
              Upgrade Plan
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
