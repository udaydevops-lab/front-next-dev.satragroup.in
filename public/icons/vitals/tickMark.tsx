import React from "react";

function TickMarkIcon(props:any) {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="35"
    height="35"
    fill={props.fill?props.fill:"#308acf"}
    stroke="#308acf"
    strokeWidth="15.192"
    version="1.1"
    viewBox="-137.21 -137.21 764.47 764.47"
    xmlSpace="preserve"
  >
    <path d="M418.275 418.275c95.7-95.7 95.7-250.8 0-346.5s-250.8-95.7-346.5 0-95.7 250.8 0 346.5 250.9 95.7 346.5 0zm-261.1-210.7l55.1 55.1 120.7-120.6 42.7 42.7-120.6 120.6-42.8 42.7-42.7-42.7-55.1-55.1 42.7-42.7z"></path>
  </svg>
  );
}

export default TickMarkIcon;
