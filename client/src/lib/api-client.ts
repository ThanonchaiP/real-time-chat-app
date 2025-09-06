import axios from "axios";

export type ApiErrorResponse = {
  message: string;
  statusCode: number;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const originalRequest = error.config;

    const refreshTokenUrls = ["/auth/refresh-token", "/auth/logout"];

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !refreshTokenUrls.includes(originalRequest.url) &&
      !originalRequest.url?.includes("/auth/signin")
    ) {
      originalRequest._retry = true;

      try {
        await apiClient.post("/auth/refresh-token");
        return apiClient(originalRequest); // Retry the original request
      } catch (err) {
        return Promise.reject(err);
      }
    }

    if (refreshTokenUrls.includes(error.config.url)) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
