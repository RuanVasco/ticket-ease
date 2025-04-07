import { useState, useEffect } from "react";

interface OptionEditorProps {
    value?: { label: string; value: string }[];
    onChange: (options: { label: string; value: string }[]) => void;
}

const OptionEditor: React.FC<OptionEditorProps> = ({ value = [], onChange }) => {
    const [text, setText] = useState("");

    useEffect(() => {
        setText(value.map(opt => opt.label).join(", "));
    }, [value]);

    const handleBlur = () => {
        const labels = text
            .split(",")
            .map((label) => label.trim())
            .filter(Boolean);

        const options = labels.map((label) => ({
            label,
            value: label.toLowerCase().replace(/\s+/g, "-"),
        }));

        onChange(options);
    };

    return (
        <textarea
            className="form-control"
            placeholder="Opção 1, Opção 2, Opção 3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
        />
    );
};

export default OptionEditor;
