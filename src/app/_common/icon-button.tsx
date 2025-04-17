"use client"
import React from "react";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
export default function IconButton(props: any) {
  return (
    <div
      className="cursor-pointer w-8 h-8 bg-white-300 rounded-t-xl rounded-b-xl flex justify-center items-center border-solid border-2 border-blue-300 "
      onClick={props.onClick}
    >
      {props.icon ? props.icon : <MoreHorizIcon fontSize="small" />}
    </div>
  );
}
