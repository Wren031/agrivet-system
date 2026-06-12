import { Platform } from "react-native";

const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://172.20.10.2:3000/api";
  }
  return "http://172.20.10.2:3000/api";
};

export const API_BASE_URL = getBaseUrl();
