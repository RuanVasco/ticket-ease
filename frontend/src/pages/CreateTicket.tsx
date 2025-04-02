import { useState, useEffect } from "react";
import { FaAngleRight, FaAngleLeft, FaFolderOpen, FaClipboardList } from "react-icons/fa6";

import axiosInstance from "../components/AxiosConfig";
import "../assets/styles/create_ticket.css";
import { TicketCategory } from "../types/TicketCategory";
import { Form } from "../types/Form";
import { DynamicForm } from "../components/DynamicForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TicketProperty } from "../types/TicketProperties";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const CreateTicket: React.FC = () => {
    const [categories, setCategories] = useState<TicketCategory[]>([]);
    const [forms, setForms] = useState<Form[]>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [categoryPath, setCategoryPath] = useState<TicketCategory[]>([]);
    const [currentForm, setCurrentForm] = useState<Form>({} as Form);
    const [properties, setProperties] = useState<TicketProperty>({
        urgency: "BAIXA",
        receiveEmail: false,
        observers: []
    });

    const navigate = useNavigate();

    const fetchCategories = async (fatherId: string | null = null) => {
        try {
            const url = fatherId
                ? `${API_BASE_URL}/tickets-category/with-form?fatherId=${fatherId}`
                : `${API_BASE_URL}/tickets-category/with-form`;

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
                `${API_BASE_URL}/tickets-category/forms/${categoryId}`
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
    };

    const handleFormClick = (form: Form) => {
        setCurrentForm(form);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            formId: currentForm.id,
            responses: Object.entries(formData).map(([fieldId, value]) => ({
                fieldId: Number(fieldId),
                value
            })),
            properties: {
                observersId: properties.observers ?? [],
                urgency: properties.urgency,
                receiveEmail: properties.receiveEmail
            }
        };

        try {
            const res = await axiosInstance.post(`${API_BASE_URL}/ticket`, data);
            if (res.status === 200) {
                toast.success("Ticket criado");
                navigate(`/ticket/${res.data}`);
            }
        } catch (error) {
            toast.error("Erro ao criar ticket");
            console.error(error);
        }
    };

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
    };

    return (
        <main>
            <div className="container-xxl">
                <div className="row mt-3">
                    <div className="col-3">
                        <div>
                            <div className="nav_forms_cat_head">
                                {categoryPath.length > 0 ? (
                                    <button onClick={handleBack} className="nav_forms_cat_btn_back">
                                        <FaAngleLeft />
                                        <span className="ms-2">
                                            {categoryPath[categoryPath.length - 1]?.name}
                                        </span>
                                    </button>
                                ) : (
                                    <span>Selecione um categoria</span>
                                )}
                            </div>

                            <ul className="mt-2 nav_forms_cat_list">
                                {forms.map((item) => (
                                    <li
                                        key={item.id}
                                        className={`nav_forms_cat_item${currentForm.id === item.id ? " item_selected" : ""}`}
                                    >
                                        <div>
                                            <a
                                                onClick={() => handleFormClick(item)}
                                                className="d-flex align-items-center tree_item"
                                                role="button"
                                                style={{ cursor: "pointer" }}
                                            >
                                                <FaClipboardList />
                                                <span className="ms-2">{item.title}</span>
                                            </a>
                                        </div>
                                    </li>
                                ))}
                                {categories.map((item) => (
                                    <li key={item.id} className="nav_forms_cat_item">
                                        <div>
                                            <a
                                                onClick={() => handleCategoryClick(item)}
                                                className="d-flex align-items-center tree_item"
                                                role="button"
                                                style={{ cursor: "pointer" }}
                                            >
                                                <FaFolderOpen />
                                                <span className="ms-2">{item.name}</span>
                                                <FaAngleRight className="ms-auto" />
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col border-start ps-4 form_box">
                        {currentForm.fields && currentForm.fields.length != 0 && (
                            <DynamicForm
                                form={currentForm}
                                formData={formData}
                                setFormData={setFormData}
                                preview={false}
                                handleSubmit={handleSubmit}
                                properties={properties}
                                setProperties={setProperties}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreateTicket;
