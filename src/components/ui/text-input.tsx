import type { InputHTMLAttributes } from "react";
import { Input } from "./input";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
};

export function TextInput(props: TextInputProps) {
    return <Input {...props} />;
}
