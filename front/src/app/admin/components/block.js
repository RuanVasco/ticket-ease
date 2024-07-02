import Link from "next/link";
import styles from "./block.css";

const Block = ({text, icon, link, description}) => {
    return (
        <div>
            <Link href={link} className="block_ d-flex align-itens-center">
                <span className="icon_block">{icon}</span>
                <div className="d-flex justify-content-center flex-column ms-3">
                    <span className="titulo_block">{text}</span><br></br>
                    <span className="description_block">{description}</span>
                </div>                
            </Link>            
        </div>
    );
}

export default Block;