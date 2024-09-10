import { Link, LinkProps } from "@remix-run/react";

interface Props extends LinkProps {}

export function AuthLink({ className, children, to, ...props }: Props) {
  return (
    <Link
      className={`text-center text-gray-500 underline ${className}`}
      to={to}
      {...props}
    >
      {children}
    </Link>
  );
}
