"use client";

import React from "react";
import { Textarea } from "@material-tailwind/react";
import { useState } from "react";
import { sanitizeInput } from "../utilities/sanitizeInput";

export default function TextArea(props: any) {
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = sanitizeInput(e.target.value);
    props.getSelectedItems(newInputValue);
    setInputValue(newInputValue);
  };
  return (
    <div className="relative w-full min-w-[200px]">
      <Textarea
        color="blue"
        value={inputValue}
        label={props.label}
        className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-indigo-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
        name={props.name}
        onChange={(event: any) => handleInputChange(event)}
      />
    </div>
  );
}
