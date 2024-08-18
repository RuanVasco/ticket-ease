"use client"

import React, { useState, useEffect } from 'react';
import axiosInstance from "../components/axiosConfig";
import Header from '../components/header/header';
import AttachmentsForm from '../components/attachmentsForm/attachmentsForm';
import { FaAngleRight, FaAngleLeft, FaFolderOpen, FaClipboardList, FaPlus } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';
import withAuth from '../auth/withAuth';
import style from "./style.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AbrirChamado = () => {
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryPath, setCategoryPath] = useState([]);
    const [category, setCategory] = useState(null);
    const [ticket, setTicket] = useState({
        ticketCategory_id: '',
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
                const res = await axiosInstance.get(`${API_BASE_URL}/tickets-category/`);
                if (res.status === 200) {
                    setCategories(res.data);
                } else {
                    console.error('Error fetching data:', res.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            const data = organizeData();
            setCurrentCategory(data);
        }
    }, [categories]);

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

        departmentMap.forEach(department => {
            root.children.push(department);
        });

        return root;
    };

    const handleCategoryClick = (cat) => {

        if (cat.receiveTickets) {
            setCategory(cat);
        }

        if (cat.children.length > 0) {
            setCurrentCategory(cat);
            setCategoryPath([...categoryPath, cat]);
        }
    };

    const handleBack = () => {
        const newPath = [...categoryPath];

        newPath.pop();
        setCurrentCategory(newPath.length > 0 ? newPath[newPath.length - 1] : organizeData());
        setCategoryPath(newPath);
    };

    const renderTreeNavigation = (data) => {
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
                        .map((item) => (
                            <li key={uuidv4()} className={`nav_forms_cat_item${category === item ? ' item_selected' : ''}`}>
                                <div>
                                    <a
                                        onClick={() => handleCategoryClick(item)}
                                        className="d-flex align-items-center"
                                        role="button"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {item.receiveTickets ? (
                                            <FaClipboardList />
                                        ) : (
                                            <FaFolderOpen />
                                        )}                             
                                        <span className="ms-2">{item.name}</span>                                        
                                        {item.children.length > 0 && <FaAngleRight className='ms-auto' />}
                                    </a>
                                    {currentCategory === item && (
                                        <div>
                                            {renderTreeNavigation(item)}
                                        </div>
                                    )}
                                </div>
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

        if (!category) {
            console.error('Form is not loaded.');
            return;
        }

        const formData = new FormData();

        const ticketDTO = {
            ticketCategory_id: category.id,
            name: ticket.name,
            description: ticket.description,
            observation: ticket.observation || '',
            urgency: ticket.urgency,
            receiveEmail: ticket.receiveEmail
        };

        formData.append("ticketDTO", new Blob([JSON.stringify(ticketDTO)], { type: "application/json" }));

        for (let i = 0; i < attachments.length; i++) {
            formData.append("files", attachments[i]);
        }

        try {
            const res = await axiosInstance.post(`${API_BASE_URL}/tickets/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (res.status === 200 || res.status === 201) {
                window.location.href = `http://localhost:3000/chamados/${res.data}`;
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
                    <div className="col-3">
                        {currentCategory ? renderTreeNavigation(currentCategory) : null}
                    </div>
                    <div className="col border-start ps-4 form_box">
                        {category ? (
                            <div>
                                <h2>{category.name}</h2>
                                <form onSubmit={handleSubmitForm}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Assunto *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={ticket.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Descrição *</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="3"
                                            value={ticket.description}
                                            onChange={handleInputChange}
                                            required
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
                                        <label htmlFor="urgency" className="form-label">Urgência *</label>
                                        <select
                                            className="form-select"
                                            id="urgency"
                                            name="urgency"
                                            value={ticket.urgency}
                                            onChange={handleInputChange}
                                            required
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
                                    <label className="form-label">Anexos</label>
                                    <AttachmentsForm onFilesChange={handleFilesChange} />
                                    <button type="submit" className="btn btn-send mt-3 d-block mx-auto"><FaPlus /> Enviar</button>
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

export default withAuth(AbrirChamado);
