"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInterceptor from './axiosInterceptor';
import axios from 'axios';

const withAuth = (WrappedComponent) => {
    const WithAuth = (props) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const checkAuth = async () => {
                const token = localStorage.getItem('token');
                const refreshToken = localStorage.getItem('refreshToken');

                if (!token) {
                    if (refreshToken) {
                        try {
                            const response = await axios.post('http://localhost:8080/auth/refresh', { refreshToken: refreshToken });
                            localStorage.setItem('token', response.data.token);
                            setLoading(false);
                        } catch (error) {
                            router.push('/auth/login');
                        }
                    } else {
                        router.push('/auth/login');
                    }
                } else {
                    try {
                        await axiosInterceptor.post('/auth/validate', { token });
                        setLoading(false);
                    } catch (error) {
                        localStorage.removeItem('token');
                        router.push('/auth/login');
                    } finally {
                        setLoading(false);
                    }
                }
            };

            checkAuth();
        }, [router]);

        if (loading) {
            return <div></div>;
        }

        return <WrappedComponent {...props} />;
    };

    WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

    return WithAuth;
};

const getDisplayName = (WrappedComponent) => {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default withAuth;
