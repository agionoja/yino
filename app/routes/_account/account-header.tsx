import { Link } from "@remix-run/react";
import { User } from "~/models/user.model";
import logo from "~/assets/images/logo.png";
import avatar from "~/assets/icons/avatar.svg";
import { AdminNavList } from "~/routes/_account/admin-nav-list";
import { ClientNavList } from "~/routes/_account/client-nav-list";
import { NavItem } from "~/routes/_account/nav-item";
import { Logout, Support } from "~/components/icons";
import { ROUTES } from "~/routes";

type Props = Pick<User, "role" | "email" | "name" | "photo">;

export function AccountHeader({ role, name, email, photo }: Props) {
  return (
    <header
      className={
        "flex h-full shrink-0 flex-col justify-between bg-off-black p-5 text-white md:w-1/3 lg:w-1/5"
      }
    >
      <div className={"flex flex-col gap-7"}>
        <Link to={"/"}>
          <img src={logo} alt="Yino Logo" />
        </Link>
        <nav>{role === "admin" ? <AdminNavList /> : <ClientNavList />}</nav>
      </div>

      <ul className={"nav-list"}>
        <li>
          <NavItem reloadDocument to={ROUTES.LOGOUT} prefetch={"none"}>
            <Logout size={25} />
            <span>Log out</span>
          </NavItem>
        </li>
        <li>
          <NavItem to={ROUTES.SUPPORT}>
            <Support className={"text-blue"} size={25} />
            <span>Support</span>
          </NavItem>
        </li>

        <li className={"overflow-hidden"}>
          <NavItem to={`/account/settings/personal-info`}>
            <img src={photo ? photo.url : avatar} alt="" />
            <div className={"flex flex-col gap-3"}>
              <span>{name}</span>
              <span className={"text-sm"}>{email}</span>
            </div>
          </NavItem>
        </li>
      </ul>
    </header>
  );
}
