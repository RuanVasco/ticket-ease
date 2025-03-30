import { useState } from "react";

type FieldType = "TEXT" | "TEXTAREA" | "NUMBER" | "SELECT" | "CHECKBOX" | "RADIO" | "DATE";

interface FormField {
    id: number;
    label: string;
    name: string;
    type: FieldType;
    required: boolean;
    placeholder?: string;
    options?: string[];
}

interface FormData {
    title: string;
    description: string;
    ticketCategoryId: number;
    userId: number;
    fields: FormField[];
}

const initialField = (): FormField => ({
    id: Date.now(),
    label: "",
    name: "",
    type: "TEXT",
    required: false,
    placeholder: "",
    options: [],
});

const FormBuilder = () => {
    const [form, setForm] = useState<FormData>({
        title: "",
        description: "",
        ticketCategoryId: 1,
        userId: 1,
        fields: [],
    });

    const addField = () => {
        setForm(prev => ({
            ...prev,
            fields: [...prev.fields, initialField()],
        }));
    };

    const updateField = (index: number, updated: Partial<FormField>) => {
        const newFields = [...form.fields];
        newFields[index] = { ...newFields[index], ...updated };
        setForm({ ...form, fields: newFields });
    };

    const removeField = (index: number) => {
        const newFields = form.fields.filter((_, i) => i !== index);
        setForm({ ...form, fields: newFields });
    };

    const handleSubmit = async () => {
        const response = await fetch("/api/forms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (response.ok) alert("Formulário criado com sucesso!");
    };

    return (
        <div>
            <h2>Criar Formulário</h2>

            <input
                type="text"
                placeholder="Título"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <textarea
                placeholder="Descrição"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <button onClick={addField}>Adicionar Campo</button>

            {form.fields.map((field, index) => (
                <div key={field.id}>
                    <input
                        placeholder="Label"
                        value={field.label}
                        onChange={e => updateField(index, { label: e.target.value })}
                    />
                    <select
                        value={field.type}
                        onChange={e => updateField(index, { type: e.target.value as FieldType })}
                    >
                        <option value="TEXT">Texto</option>
                        <option value="NUMBER">Número</option>
                        <option value="SELECT">Seleção</option>
                        <option value="DATE">Data</option>
                    </select>

                    {field.type === "SELECT" && (
                        <textarea
                            placeholder="Opções separadas por vírgula"
                            value={field.options?.join(",")}
                            onChange={e => updateField(index, { options: e.target.value.split(",") })}
                        />
                    )}

                    <button onClick={() => removeField(index)}>Remover</button>
                </div>
            ))}

            <button onClick={handleSubmit}>Salvar</button>
        </div>
    );
};

export default FormBuilder;
