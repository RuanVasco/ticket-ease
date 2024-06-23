"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import "../components/login_form.css";

export default function Login() {     
    const router = useRouter();

    const [formData, setFormData] = useState({
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
            const res = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                console.log(res);
                router.push('/'); 
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
                <div>    
                    <div className="p-2">
                        <Link href="..">Voltar</Link> 
                    </div> 
                    <form onSubmit={handleSubmit} className="border p-4 rounded form_">
                        <div>
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input type="email" className="form-control" name="email" id="email" placeholder="nome@exemplo.com" value={formData.email} onChange={handleChange} required></input>
                        </div> 
                        <div className="mt-3">                   
                            <label htmlFor="password" className="form-label">Senha</label>
                            <input type="password" className="form-control" name="password" id="password" value={formData.password} onChange={handleChange} required></input>
                        </div>
                        <div className="mt-3 d-flex justify-content-between align-items-center"> 
                            <span className="label_signin">
                                <Link href="/login/register">
                                    Não tem conta?<br></br>Se registre.
                                </Link>
                            </span>                           
                            <button type="submit" className="button_default">Logar</button>
                        </div>
                    </form>
                </div>
            </div>            
        </main>
    );
}