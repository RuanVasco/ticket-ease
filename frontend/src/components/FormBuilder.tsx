import { useEffect, useState } from "react";
import { FormField } from "../types/FormField";
import { Form } from "../types/Form";
import { TicketCategory } from "../types/TicketCategory";
import axiosInstance from "./AxiosConfig";
import { FaArrowRotateRight, FaFloppyDisk, FaMinus, FaPencil, FaPlus } from "react-icons/fa6";
import { fetchCategories } from "../services/TicketCategoryService";
import { toast } from "react-toastify";
import { User } from "../types/User";
import OptionEditor from "./Fields/OptionEditor";
import Select from "react-select";
import { Modal } from "bootstrap";
import { ApprovalModeEnum } from "../enums/ApprovalModeEnum";

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
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [approvers, setApprovers] = useState<User[]>([]);
    const [selectedApprovers, setSelectedApprovers] = useState<User[]>([]);
    const [approvalMode, setApprovalMode] = useState<"AND" | "OR">("AND");
    const [newField, setNewField] = useState<FormField>({
        id: "",
        label: "",
        type: fieldTypes[0] || "TEXT",
        required: false,
        placeholder: "",
        options: [],
    });

    useEffect(() => {
        loadFieldTypes();
        loadCategories();

    }, []);

    useEffect(() => {
        if (form.ticketCategory.id) {
            loadApprovers(Number(form.ticketCategory.id));
        }
    }, [form.ticketCategory]);

    useEffect(() => {
        if (screenType === "create") {
            setForm({
                id: "",
                title: "",
                ticketCategory: {} as TicketCategory,
                approvers: [],
                approvalMode: ApprovalModeEnum.AND,
                description: "",
                creator: {} as User,
                fields: [],
            });
        }
    }, [screenType]);

    useEffect(() => {
        if (screenType === "edit" && form.approvers?.length > 0) {
            setSelectedApprovers(form.approvers);
            setApprovalMode(form.approvalMode || "AND");
        }
    }, [screenType, form.approvers, form.approvalMode]);

    const loadApprovers = async (categoryId: number) => {
        try {
            const res = await axiosInstance.get(`${API_BASE_URL}/ticket-category/${categoryId}/approvers`);
            if (res.status === 200) {
                setApprovers(res.data);
            }
        } catch (error) {
            console.error("Error fetching field types:", error);
        }
    };

    const loadCategories = async () => {
        const categories = await fetchCategories();
        setCategories(categories);
    };

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

    const updateField = (index: number, updated: Partial<FormField>) => {
        const newFields = [...form.fields];
        newFields[index] = { ...newFields[index], ...updated };
        setForm({ ...form, fields: newFields });
    };

    const removeField = (index: number) => {
        const newFields = form.fields.filter((_, i) => i !== index);
        setForm({ ...form, fields: newFields });
    };

    const updateNewField = (updated: Partial<FormField>) => {
        setNewField(prev => ({ ...prev, ...updated }));
    };

    const handleNewFieldAllowedTypesChange = (selected: any) => {
        const selectedOptions = Array.isArray(selected) ? selected : selected ? [selected] : [];
        updateNewField({ options: selectedOptions });
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
            approvers: selectedApprovers.map((v) => v.id),
            approvalMode: approvalMode,
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
                    approvers: [],
                    approvalMode: ApprovalModeEnum.AND,
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

    const handleAddField = (e: React.FormEvent) => {
        e.preventDefault();

        if (modalMode === "edit" && editIndex !== null) {
            const newFields = [...form.fields];
            newFields[editIndex] = newField;
            setForm({ ...form, fields: newFields });
        } else {
            setForm((prev) => ({
                ...prev,
                fields: [...prev.fields, newField],
            }));
        }

        const modalElement = document.getElementById("modal-field");
        if (modalElement) {
            const modalInstance = Modal.getInstance(modalElement);
            modalInstance?.hide();
        }
    };

    const openModal = (mode: "create" | "edit", index?: number) => {
        setModalMode(mode);

        if (mode === "create") {
            setNewField({
                id: "",
                label: "",
                type: fieldTypes[0] || "TEXT",
                required: false,
                placeholder: "",
                options: [],
            });
            setEditIndex(null);
        } else if (mode === "edit" && typeof index === "number") {
            setNewField({ ...form.fields[index] });
            setEditIndex(index);
        }

        const modalElement = document.getElementById("modal-field");
        if (modalElement) {
            const modalInstance = new Modal(modalElement);
            modalInstance.show();
        }
    };

    return (
        <div className="p-3 border rounded shadow-sm bg-light">
            <div className="modal fade" id="modal-field" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">
                                {modalMode === "create" ? "Adicionar novo campo" : "Editar campo"}
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleAddField}>
                            <div className="modal-body">
                                <div className="mb-2">
                                    <label className="form-label">Nome</label>
                                    <input
                                        className="form-control"
                                        value={newField.label}
                                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">Tipo</label>
                                    <select
                                        className="form-select"
                                        value={newField.type}
                                        onChange={(e) => {
                                            const newType = e.target.value;

                                            setNewField({
                                                ...newField,
                                                type: newType,
                                                options: [],
                                            });
                                        }}
                                    >
                                        {fieldTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                {(newField.type === "SELECT" ||
                                    newField.type === "CHECKBOX" ||
                                    newField.type === "RADIO") && (
                                        <div className="mb-2">
                                            <label className="form-label">Opções (separadas por vírgula)</label>
                                            <OptionEditor
                                                value={newField.options}
                                                onChange={(options) => updateNewField({ options })}
                                            />
                                        </div>
                                    )}

                                {(newField.type === "FILE" || newField.type === "FILE_MULTIPLE") && (
                                    <div className="mb-3">
                                        <label className="form-label">Tipos de arquivos permitidos</label>
                                        <Select
                                            className="form-select"
                                            isMulti={newField.type === "FILE_MULTIPLE"}
                                            value={newField.options}
                                            onChange={(selected) => handleNewFieldAllowedTypesChange(selected)}
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
                                        disabled={newField.type === "FILE" || newField.type === "FILE_MULTIPLE"}
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`required`}
                                        checked={newField.required}
                                        onChange={(e) => updateNewField({ required: e.target.checked })}
                                    />
                                    <label className="form-check-label" htmlFor={`required`}>
                                        Obrigatório
                                    </label>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">
                                    Adicionar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
            <div className="mt-2">
                <label className="form-label">Validadores</label>
                <Select
                    isMulti
                    className="form-select"
                    isDisabled={!form.ticketCategory.id}
                    options={approvers.map((v) => ({
                        value: v.id,
                        label: `${v.name} (${v.email})`,
                    }))}
                    value={approvers
                        .filter((v) => selectedApprovers.find((s) => s.id === v.id))
                        .map((v) => ({
                            value: v.id,
                            label: `${v.name} (${v.email})`,
                        }))}
                    onChange={(options) => {
                        const selected = options.map((opt) =>
                            approvers.find((v) => v.id === opt.value)!
                        );
                        setSelectedApprovers(selected);
                    }}
                />
            </div>

            <div className="mt-2">
                <label className="form-label">Modo de Validação</label>
                <select
                    className="form-select"
                    value={approvalMode}
                    onChange={(e) => setApprovalMode(e.target.value as "AND" | "OR")}
                    disabled={selectedApprovers.length === 0}
                >
                    <option value="AND">Todos devem validar (E)</option>
                    <option value="OR">Qualquer um pode validar (OU)</option>
                </select>
            </div>
            <div className="mt-2">
                <span>Campos</span>
                <ul className="list-group mt-2">
                    {form.fields.map((field, index) => (
                        <li key={index} className="list-group-item">
                            <div>
                                {field.label} - {field.type}
                                <button
                                    type="button"
                                    className="btn btn-sm ms-4 me-2 btn-secondary"
                                    onClick={() => openModal("edit", index)}
                                >
                                    <FaPencil />
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeField(index)}
                                >
                                    <FaMinus />
                                </button>
                            </div>
                            {field.options && field.options?.length > 0 && (
                                <ul>
                                    {field.options.map((option, idx) => (
                                        <li key={idx}>{option.label}</li>
                                    ))}
                                </ul>
                            )}
                            <div className="form-check">
                                <input
                                    disabled
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
                        </li>
                    ))}
                </ul>
                <button className="btn btn-secondary mt-2" onClick={() => openModal("create")}>
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
