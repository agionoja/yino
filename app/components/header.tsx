import { Link, NavLink } from "@remix-run/react";
import logo from "app/assets/images/logo.png";

const navLinks = [
  {
    id: "1",
    name: "Home",
    path: "/",
  },
  {
    id: "2",
    name: "About",
    path: "about",
  },
  {
    id: "3",
    name: "Services",
    path: "services",
  },
  {
    id: "4",
    name: "Contact",
    path: "contact",
  },
];

export default function Header() {
  return (
    <>
      <header className="relative flex items-center justify-between py-4 font-inter text-dark-jungle-green md:px-20">
        <Link to={"/"}>
          <img src={logo} alt="logo" className="h-16" />
        </Link>
        <nav className="absolute top-24 flex w-full flex-col items-center justify-center gap-3 bg-white p-6 md:flex-row md:gap-10 md:bg-transparent">
          {navLinks.map((id, i) => (
            <div key={i}>
              <NavLink to={id.path}>
                <ul>
                  <li>{id.name}</li>
                </ul>
              </NavLink>
            </div>
          ))}
          <div className="mt-6 flex items-center gap-3 md:hidden">
            <Link to={"#"}>
              <button className="px-2 py-1 text-center text-[14px] text-dark-jungle-green">
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
        <div className="hidden items-center gap-3 md:flex">
          <Link to={"#"}>
            <button className="px-2 py-1 text-center text-[14px] text-dark-jungle-green">
              Sign In
            </button>
          </Link>
          <Link to={"#"}>
            <button className="rounded-[4px] bg-blue px-3 py-1 text-center text-[14px] text-white">
              Sign Up
            </button>
          </Link>
        </div>
      </header>
    </>
  );
}
