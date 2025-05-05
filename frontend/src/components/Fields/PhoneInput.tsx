import IMask from "imask";
import { useEffect, useRef } from "react";

const PhoneInput = ({
    value,
    onChange,
    disabled,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            const mask = IMask(inputRef.current, {
                mask: "(00) 00000-0000",
            });

            return () => mask.destroy();
        }
    }, []);

    return (
        <input
            ref={inputRef}
            className="form-control"
            type="text"
            name="phone"
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    );
};

export default PhoneInput;
