"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Generic hook for fetching data from API routes.
 * Handles loading, error, and data states.
 */
export function useApiData<T>(url: string | null, initialData?: T) {
    const [data, setData] = useState<T | null>(initialData ?? null);
    const [loading, setLoading] = useState(!!url);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!url) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url);
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${res.status}`);
            }
            const json = await res.json();
            setData(json);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData, setData };
}

/**
 * Mutation helper for POST/PUT/DELETE API calls.
 */
export async function apiMutate<T>(
    url: string,
    method: "POST" | "PUT" | "DELETE",
    body?: unknown
): Promise<{ data: T | null; error: string | null }> {
    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            return { data: null, error: err.error || `HTTP ${res.status}` };
        }
        const data = await res.json();
        return { data, error: null };
    } catch (e: unknown) {
        return {
            data: null,
            error: e instanceof Error ? e.message : "Request failed",
        };
    }
}
