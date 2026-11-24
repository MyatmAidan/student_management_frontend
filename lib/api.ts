import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export const http = {
  get:    <T>(url: string, params?: object) => api.get<T, T>(url, { params }),
  post:   <T>(url: string, body?: unknown)  => api.post<T, T>(url, body),
  put:    <T>(url: string, body?: unknown)  => api.put<T, T>(url, body),
  delete: <T = void>(url: string)           => api.delete<T, T>(url),
};
