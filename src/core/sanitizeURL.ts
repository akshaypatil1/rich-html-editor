export function sanitizeURL(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (
    trimmed.toLowerCase().startsWith("javascript:") ||
    trimmed.toLowerCase().startsWith("data:")
  ) {
    console.warn("Blocked potentially dangerous URL protocol");
    return "";
  }
  if (!trimmed.startsWith("http") && !trimmed.startsWith("#")) {
    return "https://" + trimmed;
  }
  return trimmed;
}
