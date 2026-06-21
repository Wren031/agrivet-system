import { Platform } from "react-native";

const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://192.168.8.35:3000/api";
  }
  return "http://192.168.8.35:3000/api";
};

export const API_BASE_URL = getBaseUrl();

const getImageBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://192.168.8.35:3000";
  }
  return "http://192.168.8.35:3000";
};

export const IMAGE_BASE_URL = getImageBaseUrl();

export function getImageUrl(imagePath: string | undefined | null): string | undefined {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http")) {
    const base = IMAGE_BASE_URL.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
    const [host] = base.replace("http://", "").split(":");
    return imagePath.replace(/localhost|127\.0\.0\.1/, host);
  }
  const base = IMAGE_BASE_URL.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${base}${path}`;
}
