import { jwtDecode } from 'jwt-decode';

const getUserData = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken;
        }
    }
    return null;
};

export default getUserData;
