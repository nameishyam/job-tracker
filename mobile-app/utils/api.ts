import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Constants from "expo-constants";

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || "your-fallback-api-url",
  headers: {
    "Content-Type": "application/json",
  },
});

const setupAxiosInterceptors = (token?: string | null) => {
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Remove stored data using AsyncStorage instead of localStorage
      await AsyncStorage.multiRemove(["token", "user"]);

      // Navigate using Expo Router instead of window.location
      router.replace("/login");
    }
    return Promise.reject(error);
  }
);

export { api, setupAxiosInterceptors };
