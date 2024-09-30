import { NavItem } from "~/routes/_account/nav-item";
import { Role } from "~/models/user.model";
import { Chat, Dashboard, Project } from "~/components/icons";

export function ClientNavList({ role }: { role: Role }) {
  return (
    <ul className={"nav-list"}>
      <li>
        <NavItem to={`dashboard/${role}`}>
          <Dashboard size={25} />
          <span>Dashboard</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={`projects/${role}`}>
          <Project size={25} />
          <span>Projects</span>
        </NavItem>
      </li>

      <li>
        <NavItem to={`conversations`}>
          <Chat size={25} />
          <span>Chats</span>
        </NavItem>
      </li>

      {/*<li>*/}
      {/*  <NavItem to={`activity`}>*/}
      {/*    <Activity size={25} />*/}
      {/*    <span>Activity</span>*/}
      {/*  </NavItem>*/}
      {/*</li>*/}

      {/*<li>*/}
      {/*  <NavItem to={`billing/${role}`}>*/}
      {/*    <Wallet size={25} />*/}
      {/*    <span>Billing</span>*/}
      {/*  </NavItem>*/}
      {/*</li>*/}
    </ul>
  );
}
