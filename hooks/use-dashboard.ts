"use client";

import { useState, useEffect, useCallback } from "react";

export interface DashboardData {
  coach: {
    id: string;
    full_name: string;
    email: string;
  } | null;
  stats: {
    active_clients: number;
    total_programs: number;
    renewals_due: number;
    response_rate: number;
  };
  programs: Array<{
    id: string;
    name: string;
    price: number;
    duration_weeks: number;
    description: string | null;
    status: string;
    active_enrollments?: number;
  }>;
  renewals: Array<{
    id: string;
    client_name: string;
    program: string;
    end_date: string;
    days_remaining: number;
  }>;
  recent_updates: Array<{
    id: string;
    client_name: string;
    client_initials: string;
    program_name: string;
    message: string;
    gradient: string;
  }>;
  chart_data: {
    week: Array<{ label: string; value: number }>;
    average: number;
  };
  pending_tasks: Array<{
    id: string;
    text: string;
    due: "today" | "days" | "week";
    daysUntil?: number;
    completed: boolean;
  }>;
  ai_summary: {
    id: string;
    summary_text: string;
    total_clients: number;
    responded_count: number;
    avg_energy_score: number;
  } | null;
}

interface UseDashboardOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const { autoFetch = true, refreshInterval } = options;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/data");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  useEffect(() => {
    if (refreshInterval && autoFetch) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
}
