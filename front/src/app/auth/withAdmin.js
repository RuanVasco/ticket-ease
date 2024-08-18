import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../components/axiosConfig';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const withAdmin = (WrappedComponent) => {
    const ComponentWithAdmin = (props) => {
        const [isAdmin, setIsAdmin] = useState(false);
        const [loading, setLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            const checkAdmin = async () => {
                try {
                    const res = await axiosInstance.get(`${API_BASE_URL}/users/isAdmin`);

                    if (res.status === 200 && res.data === true) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                        router.push('/auth/login');
                    }
                } catch (error) {
                    setIsAdmin(false);
                    router.push('/auth/login');
                } finally {
                    setLoading(false);
                }
            };

            checkAdmin();
        }, [router]);

        if (!isAdmin) {
            return null; 
        }

        return <WrappedComponent {...props} />;
    };

    ComponentWithAdmin.displayName = `WithAdmin(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return ComponentWithAdmin;
};

export default withAdmin;
