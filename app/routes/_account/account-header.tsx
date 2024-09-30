import { Link } from "@remix-run/react";
import { IUser } from "~/models/user.model";
import logo from "~/assets/images/logo.png";
import avatar from "~/assets/icons/avatar.svg";
import { AdminNavList } from "~/routes/_account/admin-nav-list";
import { ClientNavList } from "~/routes/_account/client-nav-list";
import { NavItem } from "~/routes/_account/nav-item";
import { Logout, Support } from "~/components/icons";

type Props = Pick<IUser, "role" | "email" | "name" | "profilePhoto">;

export function AccountHeader({ role, name, email, profilePhoto }: Props) {
  return (
    <header
      className={
        "bg-eerie-black flex min-h-full shrink-0 flex-col justify-between p-5 text-white md:w-1/3 lg:w-1/5"
      }
    >
      <div className={"flex flex-col gap-8"}>
        <Link to={"/"}>
          <img src={logo} alt="Yino Logo" />
        </Link>
        <nav>
          {role === "admin" ? (
            <AdminNavList role={role} />
          ) : (
            <ClientNavList role={role} />
          )}
        </nav>
      </div>

      <ul className={"nav-list"}>
        <li>
          <NavItem reloadDocument to={`/logout`} prefetch={"none"}>
            <Logout size={25} />
            <span>Log out</span>
          </NavItem>
        </li>
        <li>
          <NavItem to={`/account/support`}>
            <Support className={"text-blue"} size={25} />
            <span>Support</span>
          </NavItem>
        </li>

        <li className={"overflow-hidden"}>
          <NavItem to={`/account/settings/personal-info`}>
            <img src={profilePhoto ? profilePhoto.url : avatar} alt="" />
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
