import { Component } from "solid-js";
import { IconProps } from "./IconProps";

export const Check: Component<IconProps> = (props) => {
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
      <g>
        <path
          d="M4.48 7.68L1.92 5.12 0 7.04l4.48 4.48L12.8 3.2l-1.92-1.92z"
          transform="translate(1.5 1.5)"
        />
      </g>
    </svg>
  );
};
