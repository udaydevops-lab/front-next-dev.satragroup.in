"use client";
import * as React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Textarea as TextArea } from "@material-tailwind/react";
export default function Textarea(props: any) {
  return (
    <TextArea
      size="md"
      color="blue"
      aria-label={props.ariaLabel}
      label={props.label}
      minRows={props.minRows ? props.minRows : 3}
      {...props.inputRef}
      inputRef={props.inputRef}
      required={props.required}
      onBlur={props.handleBlur}
      onChange={props.onChange}
      readOnly={props.readOnly}
      disabled={props.disabled}
      value={props.value}
      className="focus:border-t-0"
    />
  );
}
