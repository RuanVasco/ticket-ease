import Link from "next/link";
import styles from "./block.css";

const Block = ({text, icon, link, description}) => {
    return (
        <div className="block_">
            <Link href={link}>
                {icon}
                {text}
                {description}
            </Link>            
        </div>
    );
}

export default Block;