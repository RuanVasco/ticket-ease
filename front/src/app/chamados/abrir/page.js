"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/header/header';
import AttachmentsForm from '../../components/attachmentsForm/attachmentsForm';
import { FaAngleRight, FaAngleLeft, FaFolderOpen, FaClipboardList } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';
import style from "./style.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AbrirChamado = () => {
    const [categories, setCategories] = useState([]);
    const [forms, setForms] = useState([]);
    const [currentForm, setCurrentForm] = useState(null);
    const [form, setForm] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryPath, setCategoryPath] = useState([]);
    const [ticket, setTicket] = useState({
        form_id: '',
        name: '',
        description: '',
        observation: '',
        urgency: "Média",
        receiveEmail: false,
    });
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/tickets-category/`);
                if (res.status === 200) {
                    setCategories(res.data);
                } else {
                    console.error('Error fetching data:', res.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchForms = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/forms/`);
                if (res.status === 200) {
                    setForms(res.data);
                } else {
                    console.error('Error fetching data:', res.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
        fetchForms();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            const data = organizeData();
            setCurrentCategory(data);
        }
    }, [categories]);

    useEffect(() => {
        if (currentForm) {
            const fetchForm = async () => {
                try {
                    const res = await axios.get(`${API_BASE_URL}/forms/${currentForm.id}`);
                    if (res.status === 200) {
                        setForm(res.data);
                    } else {
                        console.error('Error fetching form:', res.status);
                    }
                } catch (error) {
                    console.error('Error fetching form:', error);
                }
            }

            fetchForm();
        }
    }, [currentForm]);

    const organizeData = () => {
        const categoryMap = new Map();
        const departmentMap = new Map();
        let root = {
            id: 'root',
            name: 'Root Category',
            children: []
        };

        categories.forEach(category => {
            categoryMap.set(category.id, {
                ...category,
                children: []
            });
            if (category.department) {
                let departmentId = category.department.id;
                if (!departmentMap.has(departmentId)) {
                    departmentMap.set(departmentId, {
                        ...category.department,
                        children: []
                    });
                }
            }
        });

        categories.forEach(category => {
            if (category.father) {
                let parentCategory = categoryMap.get(category.father.id);
                if (parentCategory) {
                    parentCategory.children.push(categoryMap.get(category.id));
                }
            } else {
                if (category.department) {
                    let department = departmentMap.get(category.department.id);
                    if (department) {
                        department.children.push(categoryMap.get(category.id));
                    }
                }
            }
        });

        forms.forEach(form => {
            let category = categoryMap.get(form.ticketCategory.id);
            if (category) {
                if (category.hide) {
                    let dep = departmentMap.get(category.department.id);
                    dep.children.push(form);
                } else {
                    category.children.push(form);
                }
            }
        });

        departmentMap.forEach(department => {
            root.children.push(department);
        });

        return root;
    };

    const handleCategoryClick = (category) => {
        setCurrentCategory(category);
        setCategoryPath([...categoryPath, category]);
    };

    const handleBack = () => {
        const newPath = [...categoryPath];

        newPath.pop();
        setCurrentCategory(newPath.length > 0 ? newPath[newPath.length - 1] : organizeData());
        setCategoryPath(newPath);
    };

    const renderTreeNavigation = (data) => {
        if (!data || !data.children) return null;

        return (
            <div>
                <div className='nav_forms_cat_head'>
                    {categoryPath.length > 0 ? (
                        <button
                            onClick={handleBack}
                            className="nav_forms_cat_btn_back"
                        >
                            <FaAngleLeft />
                            <span className="ms-2">{categoryPath[categoryPath.length - 1]?.name}</span>
                        </button>
                    ) : (
                        <span>Departamentos</span>
                    )}
                </div>

                <ul className="mt-2 nav_forms_cat_list" id="nav_forms_cat_list">
                    {data.children
                        .filter(item => (item.children && item.children.length > 0 || item.ticketCategory))
                        .map((item) => (
                            <li key={uuidv4()} className={`nav_forms_cat_item${currentForm === item ? ' item_selected' : ''}`}>
                                {(item.children && item.children.length > 0) ? (
                                    <div>
                                        <a
                                            onClick={() => handleCategoryClick(item)}
                                            className="d-flex align-items-center"
                                            role="button"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <FaFolderOpen />
                                            <span className="ms-2">{item.name}</span>
                                            <FaAngleRight className='ms-auto' />
                                        </a>
                                        {currentCategory === item && (
                                            <div>
                                                {renderTreeNavigation(item)}
                                            </div>
                                        )}
                                    </div>
                                ) : item.ticketCategory ? (
                                    <a
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setCurrentForm(item)}
                                        className="d-flex align-items-center"
                                    >
                                        <FaClipboardList />
                                        <span className="ms-2">{item.name}</span>
                                    </a>
                                ) : null}
                            </li>
                        ))}
                </ul>
            </div>
        );
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;

        setTicket({
            ...ticket,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFilesChange = (files) => {
        setAttachments(files);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        if (!form) {
            console.error('Form is not loaded.');
            return;
        }

        const formData = new FormData();
        formData.append("form_id", form.id);
        formData.append("name", ticket.name);
        formData.append("description", ticket.description);
        formData.append("observation", ticket.observation || ''); // Handle null observation
        formData.append("urgency", ticket.urgency);
        formData.append("receiveEmail", ticket.receiveEmail);

        for (let i = 0; i < attachments.length; i++) {
            formData.append("files", attachments[i]);
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/tickets/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (res.status === 200 || res.status === 201) {
                window.location.href = `http://localhost:3000/chamados/ver/${res.data}`;
            } else {
                console.error('Error', res.status);
            }
        } catch (error) {
            console.error('Error', error);
        }
    };

    return (
        <main>
            <Header pageName="Abrir Chamado" />
            <div className="container">
                <div className="row mt-3">
                    <div className="col-2">
                        {currentCategory ? renderTreeNavigation(currentCategory) : null}
                    </div>
                    <div className="col border-start ps-4">
                        {form ? (
                            <div>
                                <h2>{form.name}</h2>
                                <form onSubmit={handleSubmitForm}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Assunto</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={ticket.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Descrição</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="3"
                                            value={ticket.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="observation" className="form-label">Observações</label>
                                        <textarea
                                            className="form-control"
                                            id="observation"
                                            name="observation"
                                            rows="3"
                                            value={ticket.observation}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="urgency" className="form-label">Urgência</label>
                                        <select
                                            className="form-select"
                                            id="urgency"
                                            name="urgency"
                                            value={ticket.urgency}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Baixa">Baixa</option>
                                            <option value="Média">Média</option>
                                            <option value="Alta">Alta</option>
                                        </select>
                                    </div>
                                    <div className="mb-3 form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="receiveEmail"
                                            name="receiveEmail"
                                            checked={ticket.receiveEmail}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="receiveEmail">Receber E-mail</label>
                                    </div>
                                    <AttachmentsForm onFilesChange={handleFilesChange} />
                                    <button type="submit" className="btn btn-primary">Abrir Chamado</button>
                                </form>
                            </div>
                        ) : (
                            <div>Selecione um formulário</div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AbrirChamado;
