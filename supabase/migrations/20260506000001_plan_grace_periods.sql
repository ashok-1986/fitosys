CREATE TABLE plan_grace_periods (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id     UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  plan         TEXT NOT NULL,
  limit_hit_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(coach_id, plan)
);
CREATE INDEX idx_grace_periods_coach ON plan_grace_periods(coach_id);
