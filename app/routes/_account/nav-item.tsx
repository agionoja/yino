import { ReactNode } from "react";
import { NavLink, NavLinkProps } from "@remix-run/react";

interface Props extends NavLinkProps {
  children: ReactNode;
}

export function NavItem({ children, to, ...props }: Props) {
  return (
    <NavLink className={"nav-link"} to={to} prefetch={"intent"} {...props}>
      {children}
    </NavLink>
  );
}
