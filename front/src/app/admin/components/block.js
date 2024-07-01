import Link from "next/link";
import styles from "./block.module.css";

const Block = ({text, icon, link}) => {
    return (
        <div className="block_">
            <Link href={link}>
                {icon}
                {text}
            </Link>            
        </div>
    );
}

export default Block;