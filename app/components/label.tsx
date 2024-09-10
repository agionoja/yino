import React from "react";

interface Props extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  label: string;
}

export function Label({ className, children, label }: Props) {
  return (
    <label className={`flex flex-col gap-2 capitalize ${className}`}>
      <span>{label}</span> {children}
    </label>
  );
}
