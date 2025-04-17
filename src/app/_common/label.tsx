"use client";

import React, { Component } from "react";

export default function Label(props: any) {
  return (
    <div
      style={{
        color: props.color,
        fontSize: props.fontSize,
        fontFamily: props.fontFamily,
      }}
    >
      <div className={props.color}>
        {props.labelName}
        <span style={{ fontSize: props.fontSize }}>{props.subLable}</span>
      </div>
    </div>
  );
}
