import React from "react";
import { FaEyeSlash, FaRegEye, FaTasks, FaUsers } from "react-icons/fa";
import {
  IoAnalytics,
  IoChatboxOutline,
  IoClose,
  IoMenuSharp,
  IoWalletOutline,
} from "react-icons/io5";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosNotificationsOutline,
  IoMdAdd,
} from "react-icons/io";
import { MdDashboard, MdLogout } from "react-icons/md";
import { GoProjectRoadmap } from "react-icons/go";
import { LuActivitySquare, LuUsers } from "react-icons/lu";
import { FcSupport } from "react-icons/fc";
import { CiSearch } from "react-icons/ci";
import { TbSend2 } from "react-icons/tb";

interface Props extends React.SVGAttributes<SVGAElement> {
  size?: number;
}

export function Eye(props: Props): JSX.Element {
  return <FaRegEye {...props} />;
}
export function EyeSlash(props: Props): JSX.Element {
  return <FaEyeSlash {...props} />;
}

export function Close(props: Props) {
  return <IoClose {...props} />;
}

export function Hamburger(props: Props) {
  return <IoMenuSharp {...props} />;
}

export function Dashboard(props: Props) {
  return <MdDashboard {...props} />;
}

export function Team(props: Props) {
  return <FaUsers {...props} />;
}

export function Client(props: Props) {
  return <LuUsers {...props} />;
}

export function Activity(props: Props) {
  return <LuActivitySquare {...props} />;
}

export function Project(props: Props) {
  return <GoProjectRoadmap {...props} />;
}

export function Tasks(props: Props) {
  return <FaTasks {...props} />;
}

export function Analytics(props: Props) {
  return <IoAnalytics {...props} />;
}

export function Wallet(props: Props) {
  return <IoWalletOutline {...props} />;
}

export function Logout(props: Props) {
  return <MdLogout {...props} />;
}

export function Support(props: Props) {
  return <FcSupport {...props} />;
}

export function Add(props: Props) {
  return <IoMdAdd {...props} />;
}

export function Search(props: Props) {
  return <CiSearch {...props} />;
}

export function Send(props: Props) {
  return <TbSend2 {...props} />;
}

export function ArrowDown(props: Props) {
  return <IoIosArrowDown {...props} />;
}
export function ArrowUp(props: Props) {
  return <IoIosArrowUp {...props} />;
}

export function Notification(props: Props) {
  return <IoIosNotificationsOutline {...props} />;
}

export function Chat(props: Props) {
  return <IoChatboxOutline {...props} />;
}
