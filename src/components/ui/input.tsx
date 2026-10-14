import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, id, ...props }, ref) => {
        return (
            <>
                <input
                    type={type}
                    id={id}
                    className={cn(
                        "text-input flex min-h-10.5 w-full rounded-md border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text) placeholder:text-[#7a8797] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) disabled:cursor-not-allowed disabled:opacity-50",
                        error && "text-input--error border-(--error)",
                        className,
                    )}
                    ref={ref}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error && id ? `${id}-error` : undefined}
                    {...props}
                />
                {error ? (
                    <p
                        id={id ? `${id}-error` : undefined}
                        className="field-error mt-1 text-xs text-(--error)"
                        role="alert"
                    >
                        {error}
                    </p>
                ) : null}
            </>
        );
    },
);
Input.displayName = "Input";

export { Input };
