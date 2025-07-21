import axios from "axios";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/components/_login.scss";
import logo from "../assets/logo_claro.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export default function Login() {
    const navigate = useNavigate();
    const [emailUser, setEmail] = useState<string>("");
    const [passwordUser, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const Logo = () => <img src={logo} className="header_brand" alt="Logo" draggable={false} />;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: emailUser,
                password: passwordUser,
            });

            if (res.status === 200) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                navigate("/");
            }
        } catch (error: any) {
            console.error(error)
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Erro inesperado ao tentar fazer login.");
            }
        }
    };

    return (
        <main>
            <div className="d-flex justify-content-center align-items-center div_main_content">
                <form onSubmit={handleSubmit} className="border p-4 rounded">
                    <div className="d-flex justify-content-center mb-4">
                        <Logo />
                    </div>
                    <div>
                        {errorMessage && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <label htmlFor="email">
                            E-mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="nome@exemplo.com"
                            autoComplete="off"
                            value={emailUser}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <label htmlFor="password">
                            Senha
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="off"
                            value={passwordUser}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-4 d-flex justify-content-end align-items-center">
                        <button type="submit" className="btn_login d-flex align-items-center justify-content-center w-100">
                            Logar
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
