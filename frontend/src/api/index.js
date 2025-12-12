/**
 * Daniel Furniture - API Service
 */
import axios from 'axios';

// API host for images (without /api suffix)
export const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8000';

// API base URL for endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || `${API_HOST}/api`;

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refresh_token: refreshToken,
                    });

                    const { access_token, refresh_token } = response.data;
                    localStorage.setItem('access_token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);

                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, logout user
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

// ============== Auth API ==============
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateMe: (data) => api.put('/auth/me', data),
};

// ============== Products API ==============
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getFeatured: (limit = 8) => api.get('/products/featured', { params: { limit } }),
    getNewArrivals: (limit = 8) => api.get('/products/new-arrivals', { params: { limit } }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    uploadImages: (id, formData) => api.post(`/products/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ============== Categories API ==============
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// ============== Orders API ==============
export const ordersAPI = {
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data),
    updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
    cancel: (id) => api.delete(`/orders/${id}`),
};

// ============== Admin API ==============
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getRevenueByCategory: (days = 30) => api.get('/admin/analytics/revenue-by-category', { params: { days } }),
    getTopProducts: (limit = 10, days = 30) => api.get('/admin/analytics/top-products', { params: { limit, days } }),
    getLowStock: (threshold = 5) => api.get('/admin/analytics/low-stock', { params: { threshold } }),
    getRecentOrders: (limit = 10) => api.get('/admin/analytics/recent-orders', { params: { limit } }),
    getCustomers: (params) => api.get('/admin/customers', { params }),
    getCustomerDetails: (id) => api.get(`/admin/customers/${id}`),
    createUser: (data) => api.post('/admin/users', data),
};

// ============== Config API ==============
export const configAPI = {
    get: () => api.get('/config'),
};

export default api;
