import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create a configured Axios instance
const apiClient = axios.create({
  // Use environment variables for the baseURL in a real app
  // baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  baseURL: 'https://jsonplaceholder.typicode.com', // Using a placeholder API for demo
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // In a real application, retrieve the token from cookies or localStorage
    // const token = localStorage.getItem('auth_token');
    const token = 'sample_mock_token_123';
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      // Handle 401 Unauthorized globally
      if (error.response.status === 401) {
        console.warn('Unauthorized access. Redirecting to login...');
        // Example: window.location.href = '/login';
      }
      
      console.error(
        `API Error [${error.response.status}]:`,
        error.response.data || error.message
      );
    } else if (error.request) {
      console.error('Network Error: No response received', error.request);
    } else {
      console.error('Error setting up the request', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
