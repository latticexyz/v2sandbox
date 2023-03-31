import React from "react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twMerge } from "tailwind-merge";
import { PendingIcon } from "./PendingIcon";

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { pending?: boolean };

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ type, className, pending, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      type={type || "button"}
      disabled={pending || disabled}
      aria-busy={pending}
      className={twMerge(
        "group transition bg-lime-600 disabled:bg-lime-600/60 disabled:grayscale-[60%] enabled:hover:bg-green-600 disabled:cursor-not-allowed disabled:aria-busy:cursor-wait enabled:active:translate-y-0.5 shadow px-4 py-1 rounded",
        className
      )}
      {...props}
    >
      <span className="inline-grid pointer-events-none overflow-hidden">
        <span className="row-start-1 col-start-1 transition opacity-100 translate-y-0 group-[[aria-busy=true]]:-translate-y-3 group-[[aria-busy=true]]:opacity-0">
          {children}
        </span>
        <span
          className="row-start-1 col-start-1 transition opacity-0 translate-y-3 group-[[aria-busy=true]]:translate-y-0 group-[[aria-busy=true]]:opacity-100 flex items-center justify-center"
          aria-hidden
        >
          <PendingIcon />
        </span>
      </span>
    </button>
  )
);

Button.displayName = "Button";