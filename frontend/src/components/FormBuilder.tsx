import { useEffect, useState } from "react";
import { FormField } from "../types/FormField";
import { Form } from "../types/Form";
import { TicketCategory } from "../types/TicketCategory";
import axiosInstance from "./AxiosConfig";
import { FaArrowRotateRight, FaFloppyDisk, FaPlus } from "react-icons/fa6";
import { fetchCategories } from "../services/TicketCategoryService";
import { toast } from "react-toastify";
import { User } from "../types/User";
import OptionEditor from "./Fields/OptionEditor";
import Select from "react-select";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface FormBuilderProps {
    screenType: string;
    setScreenType: (type: string) => void;
    form: Form;
    setForm: React.Dispatch<React.SetStateAction<Form>>;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ screenType, setScreenType, form, setForm }) => {
    const [fieldTypes, setFieldTypes] = useState<string[]>([]);
    const [categories, setCategories] = useState<TicketCategory[]>([]);

    useEffect(() => {
        loadFieldTypes();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            const categories = await fetchCategories();
            setCategories(categories);
        };
        loadCategories();
    }, []);

    const loadFieldTypes = async () => {
        try {
            const res = await axiosInstance.get(`${API_BASE_URL}/forms/field-types`);
            if (res.status === 200) {
                setFieldTypes(res.data);
            }
        } catch (error) {
            console.error("Error fetching field types:", error);
        }
    };

    const addField = () => {
        const newField: FormField = {
            id: "",
            label: "",
            type: fieldTypes[0] || "TEXT",
            required: false,
            placeholder: "",
            options: [],
        };

        setForm((prev) => ({
            ...prev,
            fields: [...prev.fields, newField],
        }));
    };

    const updateField = (index: number, updated: Partial<FormField>) => {
        const newFields = [...form.fields];
        newFields[index] = { ...newFields[index], ...updated };
        setForm({ ...form, fields: newFields });
    };

    const removeField = (index: number) => {
        const newFields = form.fields.filter((_, i) => i !== index);
        setForm({ ...form, fields: newFields });
    };

    const handleSubmit = async () => {
        if (!form.ticketCategory?.id) {
            alert("Selecione uma categoria.");
            return;
        }

        const data = {
            title: form.title,
            description: form.description,
            ticketCategoryId: form.ticketCategory.id,
            fields: form.fields,
        };
        try {
            let res;
            let message;

            if (screenType === "edit") {
                res = await axiosInstance.put(`${API_BASE_URL}/forms/${form.id}`, data);

                message = "Formulário atualizado com sucesso!";
            } else if (screenType === "create") {
                res = await axiosInstance.post(`${API_BASE_URL}/forms`, data);

                message = "Formulário criado com sucesso!";
            }

            if (!res) return;

            if (res.status === 200 || res.status === 201) {
                setForm({
                    id: "",
                    title: "",
                    ticketCategory: {} as TicketCategory,
                    description: "",
                    creator: {} as User,
                    fields: [],
                });
                toast.success(message);
                setScreenType("view");
            }
        } catch (error) {
            toast.error("Erro ao criar o formulário.");
            console.error("Error fetching field types:", error);
        }
    };

    const handleAllowedTypesChange = (selected: any, index: number) => {
        const selectedOptions = Array.isArray(selected) ? selected : selected ? [selected] : [];

        updateField(index, { options: selectedOptions });
    };

    return (
        <div className="p-3 border rounded shadow-sm bg-light">
            <h3 className="fw-bold mb-3 text-center border-bottom pb-2">Criar Formulário</h3>
            <label htmlFor="form_title" className="form-label">
                Título
            </label>
            <input
                className="form-control"
                type="text"
                name="form_title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
            />
            <div className="my-2">
                <label htmlFor="form_description" className="form-label">
                    Descrição
                </label>
                <textarea
                    className="form-control"
                    name="form_description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
            </div>
            <div className="mt-2">
                <label htmlFor="ticket_category" className="form-label">
                    Categoria
                </label>
                <select
                    className="form-select"
                    name="ticket_category"
                    id="ticket_category"
                    value={form.ticketCategory.id}
                    onChange={(e) => {
                        const selected = categories.find(
                            (cat) => Number(cat.id) === Number(e.target.value)
                        );

                        if (selected) {
                            setForm({ ...form, ticketCategory: selected });
                        }
                    }}
                    required
                >
                    <option value="">----</option>
                    {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                            {`${item.path}`}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                {form.fields.map((field, index) => (
                    <div key={index} className="border mt-3 rounded p-3">
                        <div className="mb-2">
                            <label htmlFor={`field_label_${index}`} className="form-label">
                                Nome
                            </label>
                            <input
                                name={`field_label_${index}`}
                                className="form-control"
                                value={field.label}
                                required
                                onChange={(e) => updateField(index, { label: e.target.value })}
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Tipo</label>
                            <select
                                required
                                className="form-select"
                                value={field.type}
                                onChange={(e) => updateField(index, { type: e.target.value })}
                            >
                                {fieldTypes.map((fieldType: string) => (
                                    <option key={fieldType} value={fieldType}>
                                        {fieldType}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {(field.type === "SELECT" ||
                            field.type === "CHECKBOX" ||
                            field.type === "RADIO") && (
                                <div className="mb-2">
                                    <label className="form-label">Opções (separadas por vírgula)</label>
                                    <OptionEditor
                                        value={field.options}
                                        onChange={(options) => updateField(index, { options })}
                                    />
                                </div>
                            )}

                        {(field.type === "FILE" || field.type === "FILE_MULTIPLE") && (
                            <div className="mb-3">
                                <label className="form-label">Tipos de arquivos permitidos</label>
                                <Select
                                    className="form-select"
                                    isMulti={field.type === "FILE_MULTIPLE"}
                                    value={field.options}
                                    onChange={(selected) => handleAllowedTypesChange(selected, index)}
                                    options={[
                                        { value: 'image/*', label: 'Imagens (jpg, png, gif)' },
                                        { value: 'application/pdf', label: 'PDF (.pdf)' },
                                        { value: 'application/msword', label: 'Word (.doc)' },
                                        { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word (.docx)' },
                                        { value: 'application/vnd.ms-excel', label: 'Excel (.xls)' },
                                        { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excel (.xlsx)' },
                                        { value: 'text/plain', label: 'Texto (.txt)' },
                                    ]}
                                />
                            </div>
                        )}

                        <div className="form-check mb-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`required_${index}`}
                                checked={field.required}
                                onChange={(e) => updateField(index, { required: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor={`required_${index}`}>
                                Obrigatório
                            </label>
                        </div>

                        <button
                            type="button"
                            className="btn btn-danger mt-2"
                            onClick={() => removeField(index)}
                        >
                            Remover
                        </button>
                    </div>
                ))}
                <button className="btn btn-secondary mt-2" onClick={addField}>
                    <FaPlus /> Adicionar Campo
                </button>
            </div>
            <div className="mt-2">
                {screenType === "create" ? (
                    <button className="btn btn-primary me-2" onClick={handleSubmit}>
                        <FaFloppyDisk /> Salvar
                    </button>
                ) : (
                    <button className="btn btn-primary me-2" onClick={handleSubmit}>
                        <FaArrowRotateRight /> Atualizar
                    </button>
                )}

                <button className="btn btn-danger" onClick={() => setScreenType("view")}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default FormBuilder;
