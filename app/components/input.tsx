import { toast } from "react-toastify";
import {
  InputHTMLAttributes,
  useState,
  forwardRef,
  ForwardedRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { Eye, EyeSlash } from "~/components/icons";
import { useNavigation } from "@remix-run/react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  validate?: {
    message?: string;
    isValid: boolean;
  };
}

export interface InputRef {
  focus: () => void;
  select: () => void;
}

export const Input = forwardRef(function Input(
  { className, validate, ...props }: Props,
  ref: ForwardedRef<InputRef>,
) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current?.focus();
      },
      select() {
        inputRef.current?.select();
      },
    };
  }, []);

  useEffect(() => {
    if (validate && !validate?.isValid && !isSubmitting) {
      inputRef.current?.focus();
      inputRef.current?.select();
      toast(validate?.message, { type: "error" });
    }
  }, [validate?.message, validate?.isValid, isSubmitting]);

  return (
    <input
      {...props}
      ref={inputRef}
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
