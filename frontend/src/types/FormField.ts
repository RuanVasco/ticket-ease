export interface FormField {
	id: string;
	label: string;
	type: string;
	required: boolean;
	placeholder?: string;
	options?: { value: string; label: string }[];
}
