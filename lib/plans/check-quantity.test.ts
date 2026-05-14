import { checkClientQuantity } from './check-quantity';

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn()
}));

const { createClient } = require('@/lib/supabase/server');

describe('checkClientQuantity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows unlimited plans without checking grace periods', async () => {
    // Mock Supabase chained responses
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { plan: 'studio' }, error: null }),
    };

    // Override the second 'from' call for clients count
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'coaches') {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { plan: 'studio' }, error: null })
            })
          })
        };
      }
      if (table === 'clients') {
        return {
          select: () => ({
            eq: () => ({
              eq: async () => ({ count: 150 })
            })
          })
        };
      }
      return mockSupabase;
    });

    createClient.mockResolvedValue(mockSupabase);

    const result = await checkClientQuantity('fake-coach-id');
    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(null);
    expect(result.currentCount).toBe(150);
  });
});
