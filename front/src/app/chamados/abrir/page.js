"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/header/header';
import AttachmentsForm from '../../components/attachmentsForm/attachmentsForm';
import { FaAngleRight, FaAngleLeft, FaFolderOpen, FaClipboardList } from "react-icons/fa6";
import style from "./style.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AbrirChamado = () => {
    const [categories, setCategories] = useState([]);
    const [forms, setForms] = useState([]);
    const [currentForm, setCurrentForm] = useState(null);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryPath, setCategoryPath] = useState([]);

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
                category.children.push(form);
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
        return (
            <div>
                <div className='nav_forms_cat_head'>
                    {categoryPath.length > 0 ? (
                        <button
                            onClick={handleBack}
                            className="nav_forms_cat_btn_back"
                        >
                            <FaAngleLeft />
                            <span className="ms-2">{categoryPath.length > 0 && categoryPath[categoryPath.length - 1].name}</span>
                        </button>
                    ) : (
                        <span>/</span>
                    )}
                </div>

                <ul className="mt-2 nav_forms_cat_list">
                    {data.children
                        .filter(item => item.children && item.children.length > 0 || !item.children)
                        .map((item) => (
                            <li key={item.id} className={`nav_forms_cat_item${currentForm === item ? ' item_selected' : ''}`}>
                                {item.children && item.children.length > 0 ? (
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
                                ) : !item.children ? (
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
                                <h4 className="fw-semibold border-bottom pb-1 ps-2">{currentCategory.name + " / " + form.name}</h4>
                                <form>
                                    <input className="d-none" readOnly value={form.id}></input>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor="ticket-name" className="form-label mb-1">Assunto: </label>
                                            <input type="text" name="ticket-name" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <label htmlFor="ticket-description" className="form-label mb-1">Descrição: </label>
                                            <textarea className="form-control" name="ticket-description" required></textarea>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <label htmlFor="ticket-observation" className="form-label mb-1">Observação: </label>
                                            <textarea className="form-control" name="ticket-observation"></textarea>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <label htmlFor="ticket-attachments" className="form-label">Anexos: </label>
                                            <AttachmentsForm />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <label htmlFor="ticket-urgency" className="form-label">Urgência: </label>
                                            <select className="ms-3" name="ticket-urgency" required>
                                                <option>Alta</option>
                                                <option selected>Média</option>
                                                <option>Baixa</option>
                                            </select>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="ticket-receiveEmail" name="ticket-receiveEmail" />
                                                <label class="form-check-label" htmlFor="ticket-receiveEmail">
                                                    Receber Atualizações por E-mail
                                                </label>
                                            </div>
                                        </div>
                                    </div>                                    
                                    <button type="submit" className="btn btn-primary mt-3">Abrir Chamado</button>
                                </form>
                            </div>
                        ) : (
                            <p>Selecione uma categoria ou formulário para abrir um chamado.</p>
                        )}
                    </div>
                    <div className="col-2">
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AbrirChamado;
