import "../../assets/styles/components/_form.scss";

interface ItemsPerPageProps {
    pageSize: number;
    onPageSizeChange: (size: number) => void;
}

const ItemsPerPage: React.FC<ItemsPerPageProps> = ({ pageSize, onPageSizeChange }) => {
    return (
        <select
            id="page-size"
            className="select_bar_outlined"
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>
    );
};

export default ItemsPerPage;
