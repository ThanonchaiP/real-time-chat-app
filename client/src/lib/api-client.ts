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
