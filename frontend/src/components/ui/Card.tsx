import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border border-slate-800
        bg-slate-900
        p-6
        shadow-lg
        shadow-black/20
        transition-all
        duration-300
        hover:border-cyan-500/40
        hover:shadow-cyan-500/10
        ${className}
      `}
    >
      {children}
    </div>
  );
}