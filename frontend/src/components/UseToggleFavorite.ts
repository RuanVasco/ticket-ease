import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../components/AxiosConfig";
import { toast } from "react-toastify";

export const useToggleFavorite = (
	formId: number,
	external: boolean,
	preview = false,
	onSync?: (newValue: boolean) => void
) => {
	const [favorite, setFavorite] = useState(external);
	const [loading, setLoading] = useState(false);

	useEffect(() => setFavorite(external), [external]);

	const toggleFavorite = useCallback(async () => {
		if (preview || loading) return;

		setLoading(true);
		try {
			const method = favorite ? "delete" : "post";
			const { status } = await axiosInstance[method](`/users/me/favorite/${formId}`);

			if (status >= 200 && status < 300) {
				const newFav = !favorite;
				setFavorite(newFav);
				onSync?.(newFav);
			} else {
				throw new Error(String(status));
			}
		} catch {
			toast.error("Erro ao atualizar favorito.");
		} finally {
			setLoading(false);
		}
	}, [favorite, formId, preview, loading, onSync]);

	return { favorite, toggleFavorite, loading };
};
