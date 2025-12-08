import axios from 'axios';

const api = axios.create({
    baseURL:'http://localhost:8080/api',
    headers: {'Content-Type': 'application/json'},
    timeout: 10000,
})

// export function setAuthToken(token)
// {
//     (token)? api.defaults.headers.common['Auther'] = `Bearer ${token}`: delete api.defaults.headers.common['Auther'];
// }

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login',credentials),

    registerAdmin: (userData) => api.post('/auth/register-admin', userData),
};

export const productsAPI = {
    getAll: () => api.get('/products'), // Public
    getById: (id) => api.get(`/products/${id}`),
    create: (productData) => api.post('/products', productData), // Admin
    update: (id, productData) => api.put(`/products/${id}`,productData),
    delete: (id) => api.delete(`/products/${id}`),
};

export const ordersAPI = {
    create: (orderData) => api.post('/orders', orderData),
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    rate: (id, { rating, review }) => api.post(`/orders/${id}/rate`, { rating, review }),
};

export const usersAPI = {
    getCurrent: () => api.get('/users/me'),
    getAll: () => api.get('/users'), // Admin Only
    getById: (id) => api.get(`/users/${id}`),
    update: (id, userData) => api.put(`/users/${id}`,userData),
    delete: (id) => api.delete(`/users/${id}`),
}
export default api;