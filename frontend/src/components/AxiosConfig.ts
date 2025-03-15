import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
});

axiosInstance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && request.headers) {
        request.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("No token found in localStorage");
    }

    return request;
});

export default axiosInstance;
