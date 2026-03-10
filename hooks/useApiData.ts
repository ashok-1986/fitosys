import { useState, useEffect } from "react";

interface UseApiDataOptions {
  refetchInterval?: number;
}

export function useApiData<T>(
  endpoint: string,
  options?: UseApiDataOptions
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          setData(result);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e : new Error("Unknown error"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    // Set up interval refetch if requested
    let intervalId: NodeJS.Timeout | null = null;
    if (options?.refetchInterval) {
      intervalId = setInterval(fetchData, options.refetchInterval);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [endpoint, options?.refetchInterval]);

  return { data, loading, error };
}
