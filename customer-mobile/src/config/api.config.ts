import { Platform } from "react-native";

const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://192.168.8.40:3000/api";
  }
  return "http://192.168.8.40:3000/api";
};

export const API_BASE_URL = getBaseUrl();

export function getImageUrl(image?: string): string | null {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  const origin = getBaseUrl().replace(/\/api\/?$/, "");
  if (image.startsWith("/")) return `${origin}${image}`;
  return `${origin}/${image}`;
}
