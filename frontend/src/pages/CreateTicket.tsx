import { useState, useEffect } from "react";
import { FaAngleRight, FaAngleLeft, FaFolderOpen, FaClipboardList, FaClockRotateLeft } from "react-icons/fa6";

import "../assets/styles/pages/_createticket.scss";
import axiosInstance from "../components/AxiosConfig";
import { TicketCategory } from "../types/TicketCategory";
import { Form } from "../types/Form";
import { DynamicForm } from "../components/DynamicForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { defaultProperties, TicketProperties } from "../types/TicketProperties";
import { FaSearch } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const CreateTicket: React.FC = () => {
    const [categories, setCategories] = useState<TicketCategory[]>([]);
    const [forms, setForms] = useState<Form[]>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [categoryPath, setCategoryPath] = useState<TicketCategory[]>([]);
    const [currentForm, setCurrentForm] = useState<Form>({} as Form);
    const [properties, setProperties] = useState<TicketProperties>(defaultProperties);

    const navigate = useNavigate();

    const fetchCategories = async (fatherId: string | null = null) => {
        try {
            const url = fatherId
                ? `${API_BASE_URL}/ticket-category/with-form?fatherId=${fatherId}`
                : `${API_BASE_URL}/ticket-category/with-form`;

            const res = await axiosInstance.get(url);
            if (res.status === 200) {
                setCategories(res.data);
            }
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    const fetchForms = async (categoryId: string) => {
        try {
            const res = await axiosInstance.get(
                `${API_BASE_URL}/ticket-category/forms/${categoryId}`
            );
            if (res.status === 200) {
                setForms(res.data);
            }
        } catch (error) {
            console.error("Erro ao buscar formulários:", error);
        }
    };

    useEffect(() => {
        fetchCategories(null);
    }, []);

    const handleCategoryClick = (category: TicketCategory) => {
        setCategories([]);
        setForms([]);

        setCategoryPath([...categoryPath, category]);
        fetchCategories(category.id);
        fetchForms(category.id);
        setCurrentForm({} as Form);
    };

    const handleFormClick = (form: Form) => {
        setCurrentForm(form);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const files: { fieldId: number; files: any[]; }[] = [];

        const ticketData = {
            formId: currentForm.id,
            responses: [] as { fieldId: number; value: any }[],
            properties: {
                observersId: properties.observers,
                urgency: properties.urgency,
                receiveEmail: properties.receiveEmail,
            },
        };

        Object.entries(formData).forEach(([fieldId, value]) => {
            if (!(value instanceof File) && !(Array.isArray(value) && value[0] instanceof File)) {
                ticketData.responses.push({
                    fieldId: Number(fieldId),
                    value,
                });
            } else {
                files.push({
                    fieldId: Number(fieldId),
                    files: Array.isArray(value) ? value : [value],
                });
            }
        });

        try {
            const res = await axiosInstance.post(`${API_BASE_URL}/ticket`, ticketData);

            if ((res.status === 200 || res.status === 201)) {
                files.length > 0 && handleSubmitFiles(res.data, files);

                toast.success("Ticket criado");
                navigate(`/ticket/${res.data}`);
            }
        } catch (error) {
            toast.error("Erro ao criar ticket");
            console.error(error);
        }
    };

    const handleSubmitFiles = async (ticketId: number, files: { fieldId: number; files: File[] }[]) => {
        const formData = new FormData();

        files.forEach((entry, index) => {
            formData.append(`fileAnswers[${index}].fieldId`, entry.fieldId.toString());
            entry.files.forEach((file: File) => {
                formData.append(`fileAnswers[${index}].files`, file);
            });
        });

        try {
            const res = await axiosInstance.post(`${API_BASE_URL}/ticket/${ticketId}/attachments`, formData);

            if (res.status === 200 || res.status === 201) {
                toast.success("Arquivos enviados!");
            }
        } catch (error) {
            toast.error("Erro ao enviar arquivos");
            console.error(error);
        }
    }

    const handleBack = () => {
        const newPath = [...categoryPath];
        newPath.pop();
        const previous = newPath.length > 0 ? newPath[newPath.length - 1] : null;

        setCategoryPath(newPath);
        fetchCategories(previous?.id ?? null);
        if (previous?.id) {
            fetchForms(previous.id);
        } else {
            setForms([]);
        }

        setCurrentForm({} as Form);
    };

    return (
        <main className="container-fluid">
            <div className="row">
                <div className="categories_box col-3 pt-3 px-4">
                    <div className="categories_head d-flex align-items-center">
                        {categoryPath.length > 0 ? (
                            <button onClick={handleBack} className="btn_none">
                                <FaAngleLeft />
                                <span className="ms-3">
                                    {categoryPath[categoryPath.length - 1]?.name}
                                </span>
                            </button>
                        ) : (
                            <span>Selecione um categoria abaixo</span>
                        )}
                    </div>

                    <ul className="mt-2">
                        {forms.map((item) => (
                            <li
                                key={item.id}
                                className={`categories_item${currentForm.id === item.id ? " categories_item_selected" : ""}`}
                            >
                                <div>
                                    <a
                                        onClick={() => handleFormClick(item)}
                                        className="d-flex align-items-center"
                                        role="button"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <FaClipboardList />
                                        <span className="ms-3">{item.title}</span>
                                    </a>
                                </div>
                            </li>
                        ))}
                        {categories.map((item) => (
                            <li key={item.id} className="categories_item">
                                <div>
                                    <a
                                        onClick={() => handleCategoryClick(item)}
                                        className="d-flex align-items-center"
                                        role="button"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <FaFolderOpen />
                                        <span className="ms-3">{item.name}</span>
                                        <FaAngleRight className="ms-auto" />
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col">
                    {currentForm.fields && currentForm.fields.length != 0 ? (
                        <DynamicForm
                            form={currentForm}
                            formData={formData}
                            setFormData={setFormData}
                            preview={false}
                            handleSubmit={handleSubmit}
                            properties={properties}
                            setProperties={setProperties}
                        />
                    ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center pt-4">
                            <div className="search_wrapper">
                                <input type="text" className="search_bar" placeholder="Pesquisar por ajuda" />
                                <FaSearch className="search_icon" />
                            </div>
                            <div className="forms_shortcut">
                                <div className="shortcut_title m-4">
                                    <FaClockRotateLeft />
                                    Recentes
                                </div>
                                <div className="shortcut_grid">
                                    <div className="shortcut_item">
                                        <span>formulario 1</span>
                                        <p>afasifapifhasiphfpsiafhasihfhasfasfasfasfasfasfasfh</p>
                                    </div>
                                    <div className="shortcut_item">formulario 2</div>
                                    <div className="shortcut_item">formulario 3</div>
                                    <div className="shortcut_item">formulario 4</div>
                                    <div className="shortcut_item">formulario 5</div>
                                    <div className="shortcut_item">formulario 6</div>
                                    <div className="shortcut_item">formulario 7</div>
                                    <div className="shortcut_item">formulario 8</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default CreateTicket;
