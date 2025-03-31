import { Form } from "../types/Form";
import { DynamicForm } from "./DynamicForm";

interface Props {
    form: Form;
}

const FormPreview: React.FC<Props> = ({ form }) => {

    return (
        <div className="p-3 border rounded shadow-sm bg-light">
            <h4 className="fw-bold mb-2">Pré-visualização</h4>
            <p className="text-muted">{form.description}</p>

            {form.fields.length === 0 ? (
                <p className="text-secondary fst-italic">Nenhum campo adicionado ainda.</p>
            ) : (
                <DynamicForm form={form} preview />
            )}
        </div>
    );
};

export default FormPreview;
