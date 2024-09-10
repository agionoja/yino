import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export function Button({ className, children, ...props }: Props) {
  return (
    <button
      className={`w-full rounded-lg px-4 py-3 text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
