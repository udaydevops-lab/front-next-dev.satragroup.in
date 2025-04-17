'use client'
import React from "react";
export default function ErrorMessage(props: any) {
  return (
    <div className="l-err"
      style={{
        color: props.color,
        marginLeft: props.marginLeft,
        marginTop: props.marginTop,
      }}
    >
      <span>{props.message}</span>
    </div>
  );
}
