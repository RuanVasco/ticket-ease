import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const Header = ({ pageName }) => {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <div className="row w-100 py-2">
                    <div className="col-2">
                        <Link href=".." className="btn btn-secondary">
                            <FaArrowLeft /> Voltar
                        </Link>
                    </div>
                    <div className="col-8 d-flex justify-content-center align-items-center">
                        <h3 className="text-center fw-bold">{pageName}</h3>
                    </div>
                    <div className="col-2"></div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
