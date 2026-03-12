const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  "http://localhost:3000",
].filter(Boolean) as string[];

export function getAllowedRedirectUrl(
  requestedUrl: string | null
): string {
  const fallback = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  if (!requestedUrl) return fallback;

  try {
    const parsed = new URL(requestedUrl);
    const isAllowed = ALLOWED_ORIGINS.some((origin) => {
      try {
        return parsed.origin === new URL(origin).origin;
      } catch {
        return false;
      }
    });
    return isAllowed ? requestedUrl : fallback;
  } catch {
    return fallback;
  }
}
