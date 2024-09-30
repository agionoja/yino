import { NavItem } from "~/routes/_account/nav-item";
import { Role } from "~/models/user.model";
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

export function AdminNavList({ role }: { role: Role }) {
  return (
    <ul className={"nav-list"}>
      <li>
        <NavItem to={`account/dashboard/${role}`}>
          <Dashboard size={25} />
          <span>Dashboard</span>
        </NavItem>
      </li>
      <li>
        <NavItem to={`account/clients`}>
          <Client size={25} />
          <span>Clients</span>
        </NavItem>
      </li>
      <li>
        <NavItem to={`account/projects/${role}`}>
          <Project size={25} />
          <span>Projects</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={`account/conversations`}>
          <Chat size={25} />
          <span>Chats</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={`account/tasks`}>
          <Tasks size={25} />
          <span>Tasks</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={`account/team-management`}>
          <Team size={25} />
          <span>Team Management</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={`account/analytics`}>
          <Analytics size={25} />
          <span>Analytics</span>
        </NavItem>
      </li>
      <li>
        <NavItem to={`account/billing/${role}`}>
          <Wallet size={25} />
          <span>Billing</span>
        </NavItem>
      </li>
    </ul>
  );
}
