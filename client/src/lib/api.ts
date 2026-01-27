import axios, { type AxiosInstance } from "axios";

const BASE_URL: string = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined");
}

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fileApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
