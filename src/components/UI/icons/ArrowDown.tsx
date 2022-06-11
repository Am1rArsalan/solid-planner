import { Component } from "solid-js";
import { IconProps } from "./IconProps";

export const ArrowDownSmall: Component<IconProps> = (props) => {
  const { width, height, fill } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={width}
      height={height}
      fill={fill}
    >
      <g transform="rotate(90 8 8)">
        <g transform="translate(2 2)">
          <path fill="none" d="M0 0H12V12H0z" />
          <g transform="translate(3)">
            <path d="M6.707 5.293l-5-5A1 1 0 1 0 .293 1.707L4.586 6 .293 10.293a1 1 0 1 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414z" />
          </g>
        </g>
        <rect fill="none" width="16" height="16" rx="4" />
      </g>
    </svg>
  );
};
