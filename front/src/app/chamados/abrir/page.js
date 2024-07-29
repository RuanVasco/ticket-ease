"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/header/header';
import style from "./style.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AbrirChamado = () => {
    const [categories, setCategories] = useState([]);
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);

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

            setLoading(false);
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

            setLoading(false);
        }

        fetchData();
        fetchForms();
    }, []);

    const organizeData = () => {
        let data = [];

        const categoryMap = new Map();
        const departmentMap = new Map();

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
            data.push(department);
        });

        return data;
    };

    const renderTreeNavigation = (data) => {
        return data.map((item) => (
            <li key={item.id} className="list-tree-item">
                <a className="toggle-tree-nav" data-bs-toggle="collapse" href={`#collapseItem_${item.name}_${item.id}`} role="button" aria-expanded="false" aria-controls={`collapseItem_${item.id}`}>
                    {item.name}
                </a>
                {item.children && item.children.length > 0 && (
                    <div className="collapse" id={`collapseItem_${item.name}_${item.id}`}>
                        <ul className="list-tree ps-4">
                            {renderTreeNavigation(item.children)}
                        </ul>
                    </div>
                )}
            </li>
        ));
    };

    return (
        <main>
            <Header pageName="Abrir Chamado" />
            <div className="container">
                <div className="row">
                    <div className="col-2 p-0 border-end">
                        <ul className="list-tree">
                            {renderTreeNavigation(organizeData())}
                        </ul>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
        </main>
    )
}

export default AbrirChamado;