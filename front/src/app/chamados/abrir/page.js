"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/header/header';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
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
        console.log(categoryPath);
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
        return data.children.map((item) => {
            return (
                <li key={item.id} className="list-tree-item">
                    {categoryPath.length > 0 && (
                        <div>
                            <button onClick={handleBack} className="btn btn-link">
                                <FaAngleLeft className="me-2" /> Voltar
                            </button>
                            {categoryPath.map((category, index) => (
                                <span key={index}>{category.name} / </span>
                            ))}
                        </div>
                    )}

                    {item.children ? (
                        <div>
                            <a
                                onClick={() => handleCategoryClick(item)}
                                className="toggle-tree-nav"
                                role="button"
                                style={{ cursor: 'pointer' }}
                            >
                                {item.name}
                                <FaAngleRight className="ms-3" />
                            </a>
                            {currentCategory === item && (
                                <ul className="list-tree ps-4">
                                    {renderTreeNavigation(item)}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <a
                            style={{ cursor: 'pointer' }}
                            value={item.id}
                            onClick={() => setCurrentForm(item)}
                        >
                            {item.name} (é formulário)
                        </a>
                    )}
                </li>
            );
        });
    };

    return (
        <main>
            <Header pageName="Abrir Chamado" />
            <div className="container">
                <div className="row">
                    <div className="col-2 p-0 border-end">
                        <ul className="list-tree">
                            {currentCategory ? renderTreeNavigation(currentCategory) : null}
                        </ul>
                    </div>
                    <div className="col">
                        {form && (
                            <div>
                                <h2>{form.name}</h2>
                                <form>
                                    <input type="text" placeholder="Assunto" className="form-control mb-3" />
                                    <textarea className="form-control mb-3" placeholder="Descrição"></textarea>
                                    <button type="submit" className="btn btn-primary">Abrir Chamado</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AbrirChamado;
