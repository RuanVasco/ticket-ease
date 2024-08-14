import axios from 'axios';

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem('token');

    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('No token found in localStorage');
    }

    return request;
});

export default axiosInstance;
