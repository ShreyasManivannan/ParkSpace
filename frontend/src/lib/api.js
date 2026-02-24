import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';

        // You could add toast notifications here
        console.error('API Error:', message);

        return Promise.reject(error);
    }
);
