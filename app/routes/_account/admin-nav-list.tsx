import { NavItem } from "~/routes/_account/nav-item";
import {
  Analytics,
  Chat,
  Client,
  Dashboard,
  Project,
  Tasks,
  Team,
  Wallet,
} from "~/components/icons";
import { ROUTES } from "~/routes";

export function AdminNavList() {
  return (
    <ul className={"nav-list"}>
      <li>
        <NavItem to={ROUTES.DASHBOARD}>
          <Dashboard size={25} />
          <span>Dashboard</span>
        </NavItem>
      </li>
      <li>
        <NavItem to={ROUTES.CLIENTS}>
          <Client size={25} />
          <span>Clients</span>
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
        <NavItem to={ROUTES.TASKS}>
          <Tasks size={25} />
          <span>Tasks</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={ROUTES.TEAM_MANAGEMENT}>
          <Team size={25} />
          <span>Team Management</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={ROUTES.ANALYTICS}>
          <Analytics size={25} />
          <span>Analytics</span>
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
