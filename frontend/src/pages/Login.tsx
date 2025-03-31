import axios from "axios";
import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export default function Login() {
    const navigate = useNavigate();
    const [emailUser, setEmail] = useState<string>("");
    const [passwordUser, setPassword] = useState<string>("");

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
            } else {
                console.error("Erro ao enviar formulário:", res.status);
            }
        } catch (error) {
            console.error("Erro na autenticação:", error);
        }
    };

    return (
        <main>
            <div className="d-flex justify-content-center align-items-center div_main_content">
                <div className="div_login">
                    <form onSubmit={handleSubmit} className="border p-4 rounded form_">
                        <div>
                            <label htmlFor="email" className="form-label">
                                E-mail
                            </label>
                            <input
                                type="email"
                                className="form-control"
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
                            <label htmlFor="password" className="form-label">
                                Senha
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                id="password"
                                autoComplete="off"
                                value={passwordUser}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-3 d-flex justify-content-between align-items-center">
                            <span className="label_signin">
                                <Link to="/auth/register">
                                    Não tem conta?
                                    <br />
                                    Se registre.
                                </Link>
                            </span>
                            <button type="submit" className="button_default">
                                Logar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
