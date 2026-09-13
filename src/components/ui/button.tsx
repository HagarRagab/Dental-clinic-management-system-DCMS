import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { classNames } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function Button({ children, className, fullWidth, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={classNames("button", `button--${variant}`, fullWidth && "button--full", className)}
      {...props}
    >
      {children}
    </button>
  );
}
