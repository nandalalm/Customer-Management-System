import axios, { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status: number;
}

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message ?? error.message ?? "An unexpected error occurred",
      status: error.response?.status ?? 500,
    };
    return Promise.reject(apiError);
  }
);

export default axiosInstance;
