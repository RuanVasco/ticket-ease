"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import "../../components/login_form.css";

export default function Register() {     
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const res = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                router.push('/auth/login'); 
            } else {
                console.error('Erro ao enviar formulário:', res.status);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <main>
            <div className="d-flex justify-content-center align-items-center div_main_content">        
                <div className='div_login'>    
                    <div className="p-2">
                        <Link href=".."><FaArrowLeft /> Voltar para o Login</Link>  
                    </div> 
                    <form onSubmit={handleSubmit} className="border p-4 rounded">
                        <div>
                            <label htmlFor="name" className="form-label">Nome</label>
                            <input type="text" className="form-control" name="name" id="name" placeholder="Nome Sobrenome" value={formData.name} onChange={handleChange}></input>
                        </div>
                        <div className='mt-3'>
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input type="email" className="form-control" name="email" id="email" placeholder="nome@exemplo.com" value={formData.email} onChange={handleChange} required></input>
                        </div> 
                        <div className="mt-3">                   
                            <label htmlFor="password" className="form-label">Senha</label>
                            <input type="password" className="form-control" name="password" id="password" value={formData.password} onChange={handleChange} required></input>
                        </div>
                        <div className="mt-3 d-flex justify-content-start align-items-center">                            
                            <button type="submit" className="button_default">Registrar</button>
                        </div>
                    </form>
                </div>
            </div>            
        </main>
    );
}