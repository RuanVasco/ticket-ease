import { Form } from "../types/Form";
import SelectInput from "./Fields/SelectInput";
import NumberInput from "./Fields/NumberInput";
import { TicketProperty } from "../types/TicketProperties";
import Select from "react-select";
import { useEffect, useState } from "react";
import { MultiValue } from "react-select";
import { User } from "../types/User";
import { toast } from "react-toastify";
import axiosInstance from "./AxiosConfig";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Props {
    formData: Record<string, any>;
    setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    form: Form;
    handleSubmit?: (e: React.FormEvent) => void;
    preview?: boolean;
    properties: TicketProperty;
    setProperties: React.Dispatch<React.SetStateAction<TicketProperty>>;
}

interface OptionType {
    value: number;
    label: string;
};

export const DynamicForm: React.FC<Props> = ({ form, preview = false, handleSubmit, formData, setFormData, properties, setProperties }) => {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<OptionType>>([]);

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
        fetchUsers();
    }, []);

    const transformToMultiSelect = (user: User): OptionType => ({
        value: Number(user.id),
        label: user.name
    });

    const handleChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handlePropertiesChange = (name: string, value: any) => {
        setProperties(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={preview ? (e) => e.preventDefault() : handleSubmit}>
            <h4 className="fw-bold mb-2">{form.title}</h4>
            <p className="text-muted">{form.description}</p>

            {form.fields.map((field, index) => (
                <div key={index} className="mb-3">
                    {field.type === "TEXT" && (
                        <>
                            <label className="form-label">
                                {field.label} {field.required && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData[field.id] || ""}
                                disabled={preview}
                                onChange={e => handleChange(field.id, e.target.value)}
                            />
                        </>
                    )}

                    {field.type === "TEXTAREA" && (
                        <>
                            <label className="form-label">
                                {field.label} {field.required && <span className="text-danger">*</span>}
                            </label>
                            <textarea
                                className="form-control"
                                disabled={preview}
                                onChange={e => handleChange(field.id, e.target.value)}
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

                    {field.type === "CHECKBOX" && (
                        <div>
                            {field.options?.map((opt, i) => (
                                <div key={i} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        disabled={preview}
                                        onChange={e => handleChange(field.id, e.target.value)}
                                    />
                                    <label className="form-check-label">{opt}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    {field.type === "RADIO" && (
                        <div>
                            {field.options?.map((opt, i) => (
                                <div key={i} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        disabled={preview}
                                        onChange={e => handleChange(field.id, e.target.value)}
                                    />
                                    <label className="form-check-label">{opt}</label>
                                </div>
                            ))}
                        </div>
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
                    <label htmlFor="urgencySelect" className="form-label">Urgência</label>
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
                    <label htmlFor="observersSelect" className="form-label">Observadores</label>
                    <Select<OptionType, true>
                        id="observersSelect"
                        isMulti
                        options={options}
                        value={selectedOptions}
                        onChange={(selected) => {
                            setSelectedOptions(selected);
                            const ids = selected.map(opt => opt.value);
                            handlePropertiesChange("observers", ids);
                        }}
                        placeholder="Selecione os observadores"
                    />
                </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={preview}>Enviar</button>
        </form>
    );
};
