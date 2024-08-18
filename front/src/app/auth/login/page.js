"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import Link from "next/link";
import "../../components/login_form.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {     
    const router = useRouter();
    const [emailUser, setEmail] = useState("");
    const [passwordUser, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { email: emailUser, password: passwordUser });

            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('refreshToken', res.data.refreshToken);
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
                <div className='div_login'> 
                    <form onSubmit={handleSubmit} className="border p-4 rounded form_">
                        <div>
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input type="email" className="form-control" name="email" id="email" placeholder="nome@exemplo.com" onChange={(e) => setEmail(e.target.value)} required></input>
                        </div> 
                        <div className="mt-3">                   
                            <label htmlFor="password" className="form-label">Senha</label>
                            <input type="password" className="form-control" name="password" id="password" onChange={(e) => setPassword(e.target.value)} required></input>
                        </div>
                        <div className="mt-3 d-flex justify-content-between align-items-center"> 
                            <span className="label_signin">
                                <Link href="/auth/register">
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