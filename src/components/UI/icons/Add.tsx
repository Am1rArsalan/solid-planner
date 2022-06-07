import { Component } from "solid-js";

type Props = {
  width: number;
  height: number;
};

const Add: Component<Props> = ({ width, height }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={`${width}px`}
      height={`${height}px`}
      fill={"#fff"}
    >
      <path fill="none" d="M0 0H16V16H0z" />
      <path
        d="M6.4 0a6.4 6.4 0 1 0 6.4 6.4A6.4 6.4 0 0 0 6.4 0zm3.2 6.933H6.933V9.6H5.867V6.933H3.2V5.867h2.667V3.2h1.066v2.667H9.6z"
        transform="translate(1.333 1.333)"
      />
    </svg>
  );
};

export default Add;
