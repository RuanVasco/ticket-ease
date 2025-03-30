import axiosInstance from "../components/AxiosConfig";
import { TicketCategory } from "../types/TicketCategory";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const fetchCategories = async (): Promise<TicketCategory[]> => {
    try {
        const res = await axiosInstance.get(`${API_BASE_URL}/tickets-category/fathers`);
        if (res.status === 200) {
            return res.data.map((c: any) => TicketCategory.fromJSON(c));
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }

    return [];
};
