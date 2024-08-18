import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from "../components/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useIsAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/users/isAdmin`);

                if (res.status === 200) {
                    setIsAdmin(res.data);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    return { isAdmin, loading };
};

export default useIsAdmin;
