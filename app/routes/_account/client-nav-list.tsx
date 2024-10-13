import { NavItem } from "~/routes/_account/nav-item";
import { Activity, Chat, Dashboard, Project, Wallet } from "~/components/icons";
import { ROUTES } from "~/routes";

export function ClientNavList() {
  return (
    <ul className={"nav-list"}>
      <li>
        <NavItem to={ROUTES.DASHBOARD}>
          <Dashboard size={25} />
          <span>Dashboard</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={ROUTES.PROJECTS}>
          <Project size={25} />
          <span>Projects</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={ROUTES.CONVERSATIONS}>
          <Chat size={25} />
          <span>Chats</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={ROUTES.ACTIVITIES}>
          <Activity size={25} />
          <span>Activity</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={ROUTES.BILLING}>
          <Wallet size={25} />
          <span>Billing</span>
        </NavItem>
      </li>
    </ul>
  );
}
