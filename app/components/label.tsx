import React from "react";

interface Props extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  label: string;
  extraElement?: React.ReactNode;
}

export function Label({ className, children, label, extraElement }: Props) {
  return (
    <label className={`flex flex-col gap-2 capitalize ${className}`}>
      <div className="flex items-center justify-between">
        <span>{label}</span>
        {extraElement && <span>{extraElement}</span>}
      </div>
      {children}
    </label>
  );
}
