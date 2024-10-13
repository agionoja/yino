import { NavLink, NavLinkProps } from "@remix-run/react";
import avatar from "~/assets/icons/avatar.svg";

interface Props extends NavLinkProps {
  lastConvo: string;
  senderName: string;
  group?: string;
  photo?: string;
  unReads?: number;
  lastMsgTime: Date;
}

export default function ConversationNavItem({
  to,
  lastConvo,
  senderName,
  unReads,
  lastMsgTime,
  group,
  photo,
  ...props
}: Props) {
  const firstname = senderName.split(" ")[0];
  return (
    <NavLink
      className={"flex gap-4 rounded-lg bg-white p-2.5 shadow-sm"}
      to={to}
      {...props}
    >
      <img src={photo ? photo : avatar} alt="" />
      <div className={"flex flex-col"}>
        <h2 className={"text-lg font-bold opacity-80"}>
          {group ? group : firstname}
        </h2>
        <p className={"text-xs text-payne-gray"}>
          {group && <span className={"font-bold"}> {`${firstname} `}: </span>}
          {lastConvo}
        </p>
      </div>
      <div className={"flex shrink-0 flex-col items-center gap-2"}>
        <time className={"text-sm font-bold text-off-black"}>
          {lastMsgTime.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </time>
        {unReads && (
          <span
            className={
              "flex h-6 w-6 items-center justify-center rounded-full bg-off-black text-sm font-bold text-white"
            }
          >
            {unReads}
          </span>
        )}
      </div>
    </NavLink>
  );
}
