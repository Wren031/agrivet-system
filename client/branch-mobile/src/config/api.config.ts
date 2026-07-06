
const BASE_IP = "192.168.100.182:3000";

export const API_BASE_URL = `http://${BASE_IP}/api`;
export const IMAGE_BASE_URL = `http://${BASE_IP}`;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

export function getImageUrl(image?: string | null): string | null {
  if (!image?.trim()) return null;

  const normalized = image.trim().replace(/\\/g, "/");

  try {
    const url = new URL(normalized);
    const isLocal = LOCAL_HOSTS.has(url.hostname);

    const fullPath = `${url.pathname}${url.search}${url.hash}`;

    // If it's a local host OR backend upload path → use IMAGE_BASE_URL
    if (isLocal || url.pathname.startsWith("/uploads/")) {
      return encodeURI(`${IMAGE_BASE_URL}${fullPath}`);
    }

    // Otherwise return external URL as-is
    return encodeURI(url.toString());
  } catch {
    const path = normalized.startsWith("/")
      ? normalized
      : `/${normalized}`;

    return encodeURI(`${IMAGE_BASE_URL}${path}`);
  }
}
