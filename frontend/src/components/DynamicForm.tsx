import { Form } from "../types/Form";
import SelectInput from "./Fields/SelectInput";
import NumberInput from "./Fields/NumberInput";
import { TicketProperties } from "../types/TicketProperties";
import Select from "react-select";
import { useEffect, useState } from "react";
import { MultiValue } from "react-select";
import { User } from "../types/User";
import { toast } from "react-toastify";
import axiosInstance from "./AxiosConfig";
import SelectDepartment from "./Fields/SelectDepartment";
import AttachmentUploadInput from "./Fields/AttachmentUploadInput";
import { FaRegStar, FaStar } from "react-icons/fa6";
import "../assets/styles/components/_dynamicform.scss";
import { useToggleFavorite } from "./UseToggleFavorite";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Props {
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    form: Form;
    handleSubmit?: (e: React.FormEvent) => void;
    preview?: boolean;
    properties: TicketProperties;
    setProperties: React.Dispatch<React.SetStateAction<TicketProperties>>;
    fav?: boolean;
    onFavoriteChange?: () => void;
}

interface OptionType {
    value: number;
    label: string;
}

export const DynamicForm: React.FC<Props> = ({
    form,
    preview = false,
    handleSubmit,
    formData,
    setFormData,
    properties,
    setProperties,
    fav = false,
    onFavoriteChange
}) => {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<OptionType>>([]);
    const {
        favorite,
        toggleFavorite,
        loading,
    } = useToggleFavorite(Number(form.id), fav, preview, onFavoriteChange);

    const [useForm, setUseForm] = useState<Form | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get(`${API_BASE_URL}/users`);
            if (res.status === 200) {
                setOptions(res.data.map(transformToMultiSelect));
            }
        } catch (error) {
            toast.error("Erro ao buscar usuários");
        }
    };

    useEffect(() => {
        setUseForm(form);
    }, [form]);

    const sortFields = (): void => {
        if (!useForm) return;
        const sortedFields = [...useForm.fields].sort((f1, f2) => f1.position - f2.position);

        const isSorted = useForm.fields.every((field, idx) => field === sortedFields[idx]);

        if (!isSorted) {
            setUseForm({ ...useForm, fields: sortedFields });
        }
    };

    useEffect(() => {
        if (useForm && useForm.fields?.length > 0) {
            sortFields();
        }
    }, [useForm]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const transformToMultiSelect = (user: User): OptionType => ({
        value: Number(user.id),
        label: user.name,
    });

    const handleChange = (id: string, value: any) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handlePropertiesChange = (name: keyof TicketProperties, value: any) => {
        setProperties((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <>
            {useForm ? (
                <form onSubmit={preview ? (e) => e.preventDefault() : handleSubmit}>
                    <div className="d-flex align-items-center form_header">
                        <h4 className="fw-bold mb-0 me-2">{useForm.title}</h4>

                        <button
                            type="button"
                            className="btn p-0 bg-transparent border-0 align-middle"
                            onClick={toggleFavorite}
                            disabled={loading}
                            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {favorite ? <FaStar /> : <FaRegStar />}
                        </button>
                    </div>
                    <p className="text-muted">{useForm.description}</p>

                    {useForm.fields.map((field, index) => (
                        <div key={index} className="mb-3">
                            {(field.type === "TEXT" || field.type === "EMAIL") && (
                                <>
                                    <label className="form-label">
                                        {field.label}{" "}
                                        {field.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type={field.type === "EMAIL" ? "email" : "text"}
                                        className="form-control"
                                        value={formData[field.id] || ""}
                                        disabled={preview}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                    />
                                </>
                            )}

                            {field.type === "TEXTAREA" && (
                                <>
                                    <label className="form-label">
                                        {field.label}{" "}
                                        {field.required && <span className="text-danger">*</span>}
                                    </label>
                                    <textarea
                                        className="form-control"
                                        value={formData[field.id] || ""}
                                        disabled={preview}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                    />
                                </>
                            )}

                            {field.type === "DATE" && (
                                <>
                                    <label className="form-label">
                                        {field.label}{" "}
                                        {field.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        disabled={preview}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                    />
                                </>
                            )}

                            {field.type === "NUMBER" && (
                                <NumberInput
                                    value={formData[field.id] || ""}
                                    label={field.label}
                                    required={field.required}
                                    disabled={preview}
                                    onChange={(value) => handleChange(field.id, value)}
                                />
                            )}

                            {field.type === "SELECT" && (
                                <SelectInput
                                    value={formData[field.id] || ""}
                                    label={field.label}
                                    required={field.required}
                                    options={field.options || []}
                                    disabled={false}
                                    onChange={(value) => handleChange(field.id, value)}
                                />
                            )}

                            {field.type === "DEPARTMENT_SELECT" && (
                                <SelectDepartment
                                    value={formData[field.id] || ""}
                                    required={field.required}
                                    disabled={false}
                                    onChange={(value) => handleChange(field.id, value)}
                                />
                            )}

                            {field.type === "USER_DEPARTMENT_SELECT" && (
                                <SelectDepartment
                                    value={formData[field.id] || ""}
                                    required={field.required}
                                    disabled={false}
                                    onChange={(value) => handleChange(field.id, value)}
                                    scope="user"
                                />
                            )}

                            {field.type === "CHECKBOX" && (
                                <div>
                                    {field.options?.map((opt) => (
                                        <div key={opt.value} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={formData[field.id]?.includes(opt.value)}
                                                disabled={preview}
                                                onChange={(e) => {
                                                    const existing = formData[field.id] || [];
                                                    const updated = e.target.checked
                                                        ? [...existing, opt.value]
                                                        : existing.filter((v: any) => v !== opt.value);
                                                    handleChange(field.id, updated);
                                                }}
                                            />
                                            <label className="form-check-label">{opt.label}</label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {field.type === "RADIO" && (
                                <div>
                                    {field.options?.map((opt) => (
                                        <div key={opt.value} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                disabled={preview}
                                                onChange={(e) => {
                                                    const existing = formData[field.id] || [];
                                                    const updated = e.target.checked
                                                        ? [...existing, opt.value]
                                                        : existing.filter((v: any) => v !== opt.value);
                                                    handleChange(field.id, updated);
                                                }}
                                            />
                                            <label className="form-check-label">{opt.label}</label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {(field.type === "FILE" || field.type === "FILE_MULTIPLE") && (
                                <AttachmentUploadInput
                                    label={field.label}
                                    required={field.required}
                                    disabled={false}
                                    onChange={(value) => handleChange(field.id, value)}
                                    multiple={field.type === "FILE_MULTIPLE" ? true : false}
                                />
                            )}
                        </div>
                    ))}
                    <div className="mt-4">
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="receiveEmail"
                                checked={properties.receiveEmail}
                                onChange={(e) => handlePropertiesChange("receiveEmail", e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="receiveEmail">
                                Receber notificação por e-mail
                            </label>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="urgencySelect" className="form-label">
                                Urgência
                            </label>
                            <select
                                id="urgencySelect"
                                className="form-select"
                                value={properties.urgency}
                                onChange={(e) => handlePropertiesChange("urgency", e.target.value)}
                            >
                                <option value="BAIXA">Baixa</option>
                                <option value="MEDIA">Média</option>
                                <option value="ALTA">Alta</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="observersSelect" className="form-label">
                                Observadores
                            </label>
                            <Select<OptionType, true>
                                id="observersSelect"
                                isMulti
                                options={options}
                                value={selectedOptions}
                                onChange={(selected) => {
                                    setSelectedOptions(selected);
                                    const ids = selected.map((opt) => opt.value);
                                    handlePropertiesChange("observers", ids);
                                }}
                                placeholder="Selecione os observadores"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={preview}>
                        Enviar
                    </button>
                </form>
            ) : (
                <h4>Formulário inválido</h4>
            )}
        </>
    );
};
