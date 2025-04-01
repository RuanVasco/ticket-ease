import { useState } from "react";
import { Form } from "../types/Form";
import { DynamicForm } from "./DynamicForm";
import { TicketProperty } from "../types/TicketProperty";

interface Props {
    form: Form;
}

const FormPreview: React.FC<Props> = ({ form }) => {
    const [formData] = useState<Record<string, any>>({});
    const [properties] = useState<TicketProperty>({} as TicketProperty);

    return (
        <div className="p-3 border rounded shadow-sm bg-light">
            <h3 className="fw-bold mb-3 text-center border-bottom pb-2">Pré-visualização</h3>
            {form.title.length === 0 ? (
                <p className="text-secondary fst-italic">Nenhum campo adicionado ainda.</p>
            ) : (
                <DynamicForm
                    form={form}
                    preview={true}
                    formData={formData}
                    setFormData={() => { }}
                    properties={properties}
                    setProperties={() => { }}
                />
            )}
        </div>
    );
};

export default FormPreview;
