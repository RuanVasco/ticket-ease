import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
});

const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post('http://localhost:8080/auth/refresh', { refreshToken });
        const { token } = res.data;
        localStorage.setItem('token', token); 
        return token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const token = await refreshToken();
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
