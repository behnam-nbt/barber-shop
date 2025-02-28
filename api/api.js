import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_APP_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    },
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("accessToken"); // Get token from cookies
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
                    withCredentials: true, // Include cookies
                });
                // Update access token in cookies
                Cookies.set("accessToken", data.accessToken, { secure: true, sameSite: 'Strict' });
                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                console.error("Refresh token failed");
                // Clear tokens and redirect to login if refresh fails
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                if (typeof window !== "undefined") {
                    window.location.href = "/not-found";
                }
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
