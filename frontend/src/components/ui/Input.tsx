import type { InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`
        w-full
        rounded-xl
        border
        border-slate-700
        bg-slate-900
        px-4
        py-3
        text-white
        placeholder:text-slate-500
        outline-none
        transition-all
        focus:border-cyan-500
        focus:ring-2
        focus:ring-cyan-500/20
        ${className}
      `}
      {...props}
    />
  );
}