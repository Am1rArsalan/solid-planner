import { Component } from "solid-js";
import { IconProps } from "./IconProps";

export const ArrowUp: Component<IconProps> = (props) => {
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
      <g transform="rotate(-90 8 8)">
        <g transform="translate(2 2)">
          <g transform="translate(3)">
            <path d="M6.707 6.707l-5 5a1 1 0 1 1-1.414-1.414L4.586 6 .293 1.707A1 1 0 1 1 1.707.293l5 5a1 1 0 0 1 0 1.414z" />
          </g>
        </g>
      </g>
    </svg>
  );
};
