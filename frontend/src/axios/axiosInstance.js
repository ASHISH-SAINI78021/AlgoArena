import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // Important for cookies
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Only retry once and only for 401 errors NOT coming from refresh itself
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const { data } = await instance.post('/auth/refresh');
        
        // Update header for this and future requests
        instance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - user needs to log in again
        // Clear any stale auth state
        delete instance.defaults.headers.common['Authorization'];
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
