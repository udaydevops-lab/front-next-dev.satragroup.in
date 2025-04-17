import React from "react";

function InactiveIcon(props: any) {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="#979595"
          stroke="#979595"
          strokeWidth="0"
          transform="scale(-1 1)"
          viewBox="0 0 24 24"
        >
          <g>
            <path d="M17 7H7a5 5 0 000 10h10a5 5 0 000-10zm0 8a3 3 0 113-3 3 3 0 01-3 3z"></path>
            <path fill="none" d="M0 0h24v24H0z"></path>
          </g>
        </svg>
      );
}

export default InactiveIcon;
