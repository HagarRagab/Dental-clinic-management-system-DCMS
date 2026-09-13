import type { InputHTMLAttributes } from "react";
import { classNames } from "@/lib/utils";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function TextInput({ className, error, id, ...props }: TextInputProps) {
  return (
    <>
      <input
        id={id}
        className={classNames("text-input", error && "text-input--error", className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error ? <p id={`${id}-error`} className="field-error" role="alert">{error}</p> : null}
    </>
  );
}
