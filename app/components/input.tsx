import { InputHTMLAttributes, useState, forwardRef, ForwardedRef } from "react";
import { Eye, EyeSlash } from "~/components/icons";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = forwardRef(function Input(
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      ref={ref}
      className={`w-full rounded-lg border border-french-gray px-4 py-4 transition duration-200 focus:border-payne-gray focus:shadow focus:outline-none ${className}`}
    />
  );
});

export const PasswordInput = forwardRef(function PasswordInput(
  { ...props }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => setShowPassword((prevState) => !prevState);
  return (
    <div className={"relative w-full"}>
      <Input
        ref={ref}
        required
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <button
        onClick={handleClick}
        type={"button"}
        aria-label={"password display toggle"}
        className={"absolute right-4 top-1/2 -translate-y-1/2"}
      >
        {showPassword ? <EyeSlash /> : <Eye />}
      </button>
    </div>
  );
});
