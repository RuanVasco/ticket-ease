import { useEffect, useState } from "react";
import { Department } from "../../types/Department";
import axiosInstance from "../AxiosConfig";
import SelectInput from "./SelectInput";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface SelectInputProps {
	label: string;
	required?: boolean;
	disabled?: boolean;
	value: string;
	onChange: (value: string) => void;
	scope?: "all" | "user";
}

const SelectDepartment: React.FC<SelectInputProps> = ({
	value,
	label,
	required = false,
	disabled = false,
	onChange,
	scope = "all",
}) => {
	const [departments, setDepartments] = useState<Department[]>([]);
	const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

	const fetchDepartments = async () => {
		try {
			const endpoint =
				scope === "user"
					? `${API_BASE_URL}/users/me/departments`
					: `${API_BASE_URL}/departments/`;
			const response = await axiosInstance.get(endpoint);
			if (response.data !== null) {
				setDepartments(response.data);
			}
		} catch (error) {
			console.error("Error fetching departments:", error);
		}
	};

	useEffect(() => {
		fetchDepartments();
	}, [scope]);

	useEffect(() => {
		setOptions(
			departments
				.filter((d) => d.id !== null)
				.map((department) => ({
					value: department.id!,
					label: department.name,
				}))
		);
	}, [departments]);

	return (
		<SelectInput
			value={value || ""}
			label={label}
			required={required}
			options={options}
			disabled={disabled}
			onChange={onChange}
		/>
	);
};

export default SelectDepartment;
