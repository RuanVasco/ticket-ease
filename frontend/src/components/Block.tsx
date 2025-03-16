import { Link } from "react-router-dom";
import "../assets/styles/block.css";
import { JSX } from "react";

interface BlockProps {
    text: string;
    icon: JSX.Element;
    link: string;
    description: string;
}

const Block: React.FC<BlockProps> = ({ text, icon, link, description }) => {
    return (
        <div>
            <Link to={link} className="block_ d-flex align-items-center">
                <span className="icon_block">{icon}</span>
                <div className="d-flex flex-column ms-3 justify-content-center">
                    <span className="fw-semibold">{text}</span>
                    <span className="description_block">{description}</span>
                </div>
            </Link>
        </div>
    );
};

export default Block;
