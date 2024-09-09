import {InputHTMLAttributes, useState} from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: Props) {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <input
      className={
        "w-full border py-4 px-4 rounded-lg border-[#d0d5dd] focus:border-[#4b5768] focus:shadow transition duration-200 focus:outline-none"
      }



      {props.type === "password" ? showPassword ? "text": "password" : props.type}
    />
  );
}
