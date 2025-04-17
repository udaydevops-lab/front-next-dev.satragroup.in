import React from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";

export default function CircularShadedButton(props: any) {
   
  return (
    <>
      <Tooltip title={props.info} color="primary" placement="top" arrow>
        <div
          className={`img-cnfig text-white p-2 bg-slate-200 text-center inline-flex items-center justify-center  shadow-lg rounded-full bg-red-500 cursor-pointer hover:bg-blue-gray-600 transition-all ${props.status ? 'img-cnfig-active' : ''}`}
          onClick={() => {
            props.onButtonClick();
          }}
        >
           {props.icon ? (
          <Image src={props.icon} alt="icon" />
           ) : "icon"}
        </div>
      </Tooltip>
    </>
  );
}
