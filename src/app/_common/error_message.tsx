"use client"

import React from "react";

export default function ErrorMessage(props: any) {
  return (
    <div>
      <span className="absolute text-xs ml-1 text-red-500">{props.message}</span>
    </div>
  );
}
