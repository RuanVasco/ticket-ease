interface Permission {
    name: string;
}

import axiosInstance from "./axiosConfig";

export const getPermissions = async (id: number): Promise<Permission[]> => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
        const response = await axiosInstance.get(
            `${API_BASE_URL}/permissions/user/${id}`
        );
        
        return response.data.map((permission: { name: string; }) => permission.name); 
    } catch (error) {
        console.error("Error checking permission:", error);
        return []; 
    }
}
