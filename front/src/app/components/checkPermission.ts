interface CheckPermissionResponse {
	message: string;
	status: number;
}

import axiosInstance from "./axiosConfig";

export const checkPermission = async (
	action: string,
	entity: string
): Promise<CheckPermissionResponse> => {
	const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
	try {
		const response = await axiosInstance.get(
			`${API_BASE_URL}/permissions/has-permission?action=${action}&entity=${entity}`
		);

		return {
			message: response.data,
			status: response.status,
		};
	} catch (error) {
		console.error("Error checking permission:", error);
		return {
			message: "Erro ao verificar permissão.",
			status: 500,
		};
	}
};
