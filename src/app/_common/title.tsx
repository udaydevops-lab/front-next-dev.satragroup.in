"use client"

import React from "react";

export default function Title(props:any) {
  return (
    <div 
    className={"title-text"}
    >
      {props.titleText}
    </div>
  );
}
