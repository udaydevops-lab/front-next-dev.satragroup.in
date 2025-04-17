import React from "react";

function RadioMarkIcon(props:any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="55"
      height="55"
      fill="none"
      stroke="#308acf"
      strokeLinecap="square"
      strokeWidth="1.56"
      color="#000"
      viewBox="-4.56 -4.56 33.12 33.12"
      onClick={props.onClick}
    >
      <path
        fillRule="evenodd"
        d="M12 18a6 6 0 100-12 6 6 0 000 12z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default RadioMarkIcon;