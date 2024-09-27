import React from "react";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { IoClose, IoMenuSharp } from "react-icons/io5";

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
