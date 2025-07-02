import axios from "axios";
import cookieStorage from "./cookieStorage";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Important for HTTP-only cookies
});

// Request interceptor
API.interceptors.request.use(
    (config) => {
        // Try to get token from cookies first (client-side fallback)
        const token = cookieStorage.getAccessToken();

        // If no token in cookies, try localStorage for backward compatibility
        const legacyToken = localStorage.getItem("token");

        // Use cookie token first, fallback to localStorage
        const authToken = token || legacyToken;

        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling token refresh and errors
API.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If we get 401 and haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token using HTTP-only cookie
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                    {},
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (refreshResponse.data.success) {
                    // If new access token is provided in response, store it
                    if (refreshResponse.data.accessToken) {
                        cookieStorage.storeAccessToken(
                            refreshResponse.data.accessToken
                        );
                        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
                    }

                    // Retry the original request
                    return API(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear all tokens and redirect to login
                console.error("Token refresh failed:", refreshError);

                // Clear all stored tokens
                cookieStorage.clearTokens();
                localStorage.removeItem("token"); // Clear legacy token

                // Redirect to login page
                if (
                    window.location.pathname !== "/login" &&
                    window.location.pathname !== "/signup" &&
                    window.location.pathname !== "/forgot-password"
                ) {
                    window.location.href = "/login";
                }

                return Promise.reject(refreshError);
            }
        }

        // For other errors, just pass them through
        return Promise.reject(error);
    }
);

export default API;
