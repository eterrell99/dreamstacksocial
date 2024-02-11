
import axios from "axios";


const api = axios.create({
  baseURL: "/api", // Your API base URL
});


// Create a variable to track the refresh token request
let isRefreshing = false;
let refreshQueue = [];

// Add an interceptor to handle token refreshing
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired access token (HTTP 401)
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a token refresh request is already in progress, add this request to the queue
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;

      try {
        // Make a request to your token refresh endpoint with the refresh token
        isRefreshing = true;
        const refreshTokenResponse = await axios.post(
          "/api/token/refresh/",
          {
            refresh: localStorage.getItem("refresh"),
          }
        );

        // Update the access token in your localStorage
        localStorage.setItem("access", refreshTokenResponse.data.access);
        localStorage.setItem("refresh", refreshTokenResponse.data.refresh)
        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${refreshTokenResponse.data.access}`;

        // Resolve all queued requests with the new access token
        refreshQueue.forEach((queueItem) => {
          queueItem.resolve(refreshTokenResponse.data.access);
        });

        refreshQueue = []; // Clear the queue
        isRefreshing = false; // Reset the flag

        return axios(originalRequest);
      } catch (refreshError) {
        
        // Handle refresh error (e.g., log out the user)
        console.error("Error refreshing token:", refreshError);
          
        // Reject all queued requests with the refresh error
        refreshQueue.forEach((queueItem) => {
          queueItem.reject(refreshError);

        });

        refreshQueue = []; // Clear the queue
        isRefreshing = false; // Reset the flag
        
        // Redirect to login or handle user logout
      }
    }

    // If the error is not related to token expiration, return the error
    return Promise.reject(error);
  }
);

export default api;