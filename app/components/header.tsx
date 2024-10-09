import { useState } from "react";
import { Link, NavLink } from "@remix-run/react";
import logo from "app/assets/images/logo.png";
import { Hamburger, Close } from "./icons";

const navLinks = [
  {
    id: "1",
    name: "Home",
    path: "/",
  },
  {
    id: "2",
    name: "About",
    path: "/about",
  },
  {
    id: "3",
    name: "Services",
    path: "/services",
  },
  {
    id: "4",
    name: "Contact",
    path: "/contact",
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="relative flex items-center justify-between px-4 py-4 font-inter text-dark-jungle-green lg:px-20">
      <Link to={"/"}>
        <img src={logo} alt="logo" className="h-16" />
      </Link>
      <nav
        className={`absolute right-0 top-[6.1rem] flex w-3/4 flex-col items-center justify-center gap-3 bg-white p-6 shadow-lg md:gap-10 lg:static lg:flex-row lg:bg-transparent lg:shadow-none ${
          isMenuOpen ? "block" : "hidden lg:flex"
        }`}
      >
        {navLinks.map((link) => (
          <div key={link.id}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "font-bold"
                  : "text-dark-jungle-green hover:text-blue"
              }
            >
              {link.name}
            </NavLink>
          </div>
        ))}
        <div className="mt-6 flex items-center gap-3 lg:hidden">
          <Link to={"#"}>
            <button className="px-3 py-1 text-center text-[14px] text-dark-jungle-green hover:rounded-[4px] hover:text-blue">
              Sign In
            </button>
          </Link>
          <Link to={"#"}>
            <button className="rounded-[4px] bg-blue px-3 py-1 text-center text-[14px] text-white">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>
      <div className="hidden items-center justify-between gap-3 text-nowrap lg:flex">
        <Link to={"#"}>
          <button className="px-3 py-1 text-center text-[14px] text-dark-jungle-green hover:rounded-[4px] hover:text-blue">
            Sign In
          </button>
        </Link>
        <Link to={"#"}>
          <button className="rounded-[4px] bg-blue px-3 py-1 text-center text-[14px] text-white">
            Sign Up
          </button>
        </Link>
      </div>
      <div className="lg:hidden">
        <button onClick={toggleMenu}>
          {isMenuOpen ? <Close size={24} /> : <Hamburger size={24} />}
        </button>
      </div>
    </header>
  );
}
