import { useQuery } from "@tanstack/react-query";

export interface DashboardData {
  coach: {
    id: string;
    full_name: string;
    email: string;
  } | null;
  stats: {
    active_clients: number;
    total_programs: number;
    total_revenue: number;
    mrr: number;
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

const fetchDashboardData = async (): Promise<DashboardData> => {
  const res = await fetch("/api/dashboard/data", {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data;
};

export function useDashboard() {
  const {
    data,
    isLoading: loading,
    error,
    refetch
  } = useQuery<DashboardData, Error>({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
    staleTime: 0,
    retry: 1,
  });

  return {
    data,
    loading,
    error: error ? error.message : null,
    refetch
  };
}
