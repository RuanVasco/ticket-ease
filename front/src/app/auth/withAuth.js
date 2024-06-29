"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInterceptor from './axiosInterceptor';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true); 

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
            } else {
                axiosInterceptor.post('/auth/validate', {token:token})
                    .then(() => {
                        setLoading(false); 
                    })
                    .catch(() => {
                        localStorage.removeItem('token');
                        router.push('/auth/login');
                    })
                    .finally(() => {
                        setLoading(false); 
                    });
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
