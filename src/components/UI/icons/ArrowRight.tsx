import { Component } from "solid-js";
import { IconProps } from "./IconProps";

export const ArrowRight: Component<IconProps> = (props) => {
  const { width, height, fill, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={width}
      height={height}
      fill={fill}
      {...rest}
    >
      <path
        d="M9.3 1.3L7.9 2.7 12.2 7 0 7 0 9 12.2 9 7.9 13.3 9.3 14.7 16 8z"
        transform="translate(-876 -1003) translate(876 1003)"
      />
    </svg>
  );
};
