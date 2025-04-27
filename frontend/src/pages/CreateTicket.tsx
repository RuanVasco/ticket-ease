import { useState, useEffect } from "react";
import {
    FaAngleRight,
    FaAngleLeft,
    FaFolderOpen,
    FaClipboardList,
    FaClockRotateLeft,
    FaRegStar,
} from "react-icons/fa6";

import "../assets/styles/pages/_createticket.scss";
import axiosInstance from "../components/AxiosConfig";
import { TicketCategory } from "../types/TicketCategory";
import { Form } from "../types/Form";
import { DynamicForm } from "../components/DynamicForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { defaultProperties, TicketProperties } from "../types/TicketProperties";
import { FaSearch } from "react-icons/fa";
import FormsShortCuts from "../components/FormsShortCuts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface FormPreview {
    form: Form;
    favorite: boolean;
    accessedAt: string;
}

const CreateTicket: React.FC = () => {
    const [categories, setCategories] = useState<TicketCategory[]>([]);
    const [forms, setForms] = useState<Form[]>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [categoryPath, setCategoryPath] = useState<TicketCategory[]>([]);
    const [currentForm, setCurrentForm] = useState<Form | null>(null);
    const [currentFormFavorite, setCurrentFormFavorite] = useState<boolean>(false);
    const [properties, setProperties] = useState<TicketProperties>(defaultProperties);
    const [recentForms, setRecentForms] = useState<FormPreview[]>([]);
    const [favoriteForms, setFavoriteForms] = useState<FormPreview[]>([]);

    const navigate = useNavigate();

    const fetchRecentForms = async () => {
        try {
            const res = await axiosInstance.get(`${API_BASE_URL}/users/me/recent-forms`);
            if (res.status === 200) {
                setRecentForms(res.data);
            }
        } catch (error) {
            console.error("Erro ao buscar formulários recentes:", error);
        }
    }

    const refreshFavorites = async () => {
        const { data } = await axiosInstance.get("/users/me/favorite-forms");
        setFavoriteForms(data);
    };

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
        fetchRecentForms();
        refreshFavorites();
    }, []);

    useEffect(() => {
        setCurrentFormFavorite(
            favoriteForms.some((f) => f.form.id === currentForm?.id)
        );
    }, [favoriteForms, currentForm]);

    const handleCategoryClick = (category: TicketCategory) => {
        setCategories([]);
        setForms([]);

        setCategoryPath([...categoryPath, category]);
        fetchCategories(category.id);
        fetchForms(category.id);
        setCurrentForm(null);
    };

    const handleFormClick = (form: Form) => {
        setCurrentForm(form);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentForm) {
            toast.error("Selecione um formulário");
            return;
        }

        const files: { fieldId: number; files: any[] }[] = [];

        const ticketData = {
            formId: currentForm?.id,
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

            if (res.status === 200 || res.status === 201) {
                files.length > 0 && handleSubmitFiles(res.data, files);

                toast.success("Ticket criado");
                navigate(`/tickets/${res.data}`);
            }
        } catch (error) {
            toast.error("Erro ao criar ticket");
            console.error(error);
        }
    };

    const handleSubmitFiles = async (
        ticketId: number,
        files: { fieldId: number; files: File[] }[]
    ) => {
        const formData = new FormData();

        files.forEach((entry, index) => {
            formData.append(`fileAnswers[${index}].fieldId`, entry.fieldId.toString());
            entry.files.forEach((file: File) => {
                formData.append(`fileAnswers[${index}].files`, file);
            });
        });

        try {
            const res = await axiosInstance.post(
                `${API_BASE_URL}/ticket/${ticketId}/attachments`,
                formData
            );

            if (res.status === 200 || res.status === 201) {
                toast.success("Arquivos enviados!");
            }
        } catch (error) {
            toast.error("Erro ao enviar arquivos");
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

        setCurrentForm(null);
    };

    const handleShortcutClick = async (form: Form) => {
        try {
            setCategories([]);
            setForms([]);
            setCurrentForm(null);

            const pathRes = await axiosInstance.get(`${API_BASE_URL}/ticket-category/path/${form.ticketCategory.id}`);
            if (pathRes.status === 200) {
                const path: TicketCategory[] = pathRes.data;
                setCategoryPath(path);

                await fetchCategories(form.ticketCategory.id);
                await fetchForms(form.ticketCategory.id);

                setCurrentForm(form);
            }
        } catch (error) {
            console.error("Erro ao processar atalho:", error);
        }
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
                                className={`categories_item${currentForm?.id === item.id ? " categories_item_selected" : ""}`}
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
                    <div className="w-80">
                        {currentForm != null ? (
                            <div className="p-3">
                                <DynamicForm
                                    form={currentForm}
                                    formData={formData}
                                    setFormData={setFormData}
                                    preview={false}
                                    handleSubmit={handleSubmit}
                                    properties={properties}
                                    setProperties={setProperties}
                                    fav={currentFormFavorite}
                                    onFavoriteChange={refreshFavorites}
                                />
                            </div>
                        ) : (
                            <div className="d-flex flex-column justify-content-center align-items-center p-4">
                                <div className="search_wrapper my-2 mb-3 w-75">
                                    <input
                                        type="text"
                                        className="search_bar"
                                        placeholder="Pesquisar por ajuda"
                                    />
                                    <FaSearch className="search_icon" />
                                </div>
                                <div className="mt-3 w-100 d-flex justify-content-center flex-column gap-5">
                                    {favoriteForms.length > 0 && (
                                        <FormsShortCuts
                                            icon={FaRegStar}
                                            title={"Favoritos"}
                                            forms={favoriteForms}
                                            onFormClick={handleShortcutClick}
                                        />
                                    )}

                                    {recentForms.length > 0 && (
                                        <FormsShortCuts
                                            icon={FaClockRotateLeft}
                                            title={"Recentes"}
                                            forms={recentForms}
                                            onFormClick={handleShortcutClick}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreateTicket;
