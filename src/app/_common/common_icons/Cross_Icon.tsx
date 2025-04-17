import React from "react";

function Cross_Icon(props: any) {
  return (
    <svg
      onClick={props.onClick}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : "25"}
      height={props.width ? props.width : "25"}
      fill="none"
      viewBox="-2.5 -2.5 30 30"
    >
      <rect
        width="30"
        height="30"
        x="-2.5"
        y="-2.5"
        fill="#940000"
        strokeWidth="0"
        rx="15"
      ></rect>
      <path
        fill="#fff"
        d="M6.97 16.47a.75.75 0 101.06 1.06l-1.06-1.06zm6.06-3.94a.75.75 0 10-1.06-1.06l1.06 1.06zm-1.06-1.06a.75.75 0 101.06 1.06l-1.06-1.06zm6.06-3.94a.75.75 0 00-1.06-1.06l1.06 1.06zm-5 3.94a.75.75 0 10-1.06 1.06l1.06-1.06zm3.94 6.06a.75.75 0 101.06-1.06l-1.06 1.06zm-5-5a.75.75 0 101.06-1.06l-1.06 1.06zM8.03 6.47a.75.75 0 00-1.06 1.06l1.06-1.06zm0 11.06l5-5-1.06-1.06-5 5 1.06 1.06zm5-5l5-5-1.06-1.06-5 5 1.06 1.06zm-1.06 0l5 5 1.06-1.06-5-5-1.06 1.06zm1.06-1.06l-5-5-1.06 1.06 5 5 1.06-1.06z"
      ></path>
    </svg>
  );
}

export default Cross_Icon;
