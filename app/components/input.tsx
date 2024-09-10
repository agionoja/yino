import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeSlash } from "~/components/icons";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: Props) {
  return (
    <input
      {...props}
      className={`w-full border py-4 px-4 rounded-lg border-french-gray focus:border-payne-gray focus:shadow transition duration-200 focus:outline-none ${className}`}
    />
  );
}

export function PasswordInput({ ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => setShowPassword((prevState) => !prevState);
  return (
    <div className={"w-full relative"}>
      <Input required type={showPassword ? "text" : "password"} {...props} />
      <button
        onClick={handleClick}
        type={"button"}
        aria-label={"password display toggle"}
        className={"absolute top-1/2 -translate-y-1/2 right-4"}
      >
        {showPassword ? <EyeSlash /> : <Eye />}
      </button>
    </div>
  );
}
