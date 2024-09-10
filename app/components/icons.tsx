import React from "react";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";

interface Props extends React.SVGAttributes<SVGAElement> {
  size?: number;
}

export function Eye(props: Props): JSX.Element {
  return <FaRegEye {...props} />;
}
export function EyeSlash(props: Props): JSX.Element {
  return <FaEyeSlash {...props} />;
}
