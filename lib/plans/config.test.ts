import { getPlanLimit, planHasFeature } from './config';

describe('Plan Configuration', () => {
  describe('Quantity Limits', () => {
    it('returns correct limits for each plan', () => {
      expect(getPlanLimit('trial')).toBe(5);
      expect(getPlanLimit('starter')).toBe(10);
      expect(getPlanLimit('basic')).toBe(25);
      expect(getPlanLimit('pro')).toBe(50);
      expect(getPlanLimit('studio')).toBe(null);
    });
  });

  describe('Feature Access', () => {
    it('allows basic features on all plans', () => {
      expect(planHasFeature('trial', 'whatsapp_checkins')).toBe(true);
      expect(planHasFeature('studio', 'whatsapp_checkins')).toBe(true);
    });

    it('denies premium features on lower plans', () => {
      expect(planHasFeature('trial', 'multi_location')).toBe(false);
      expect(planHasFeature('pro', 'multi_location')).toBe(false);
      expect(planHasFeature('studio', 'multi_location')).toBe(true);
    });
  });
});
