"use client";

import React from "react";
import { Select, Option } from "@material-tailwind/react";

interface ControllerSelectProps {
  name: string;
  control: any;
  label: string;
  listItems: any[];
  value?: any;
  keyValue: string;
  displayValue: string;
  width?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  shrink?: boolean;
  handleChange?: (value: any) => void;
  placeholder?: string;
}
const ControllerSelect: React.FC<ControllerSelectProps> = (props) => {
  return (
    <Select
      size="md"
      label={props.label}
      onChange={props.handleChange}
      name={props.name}
      disabled={props.disabled}
      value={props.value}
      selected={props.value}
      placeholder={props.placeholder}
    >
      {props.listItems.map((option, index) => (
        <Option
        key={option[props.keyValue]}
          value={option[props.keyValue]}
          className="flex items-center gap-2"
        >
          {option[props.displayValue]}
        </Option>
      ))}
    </Select>
  );
};

export default ControllerSelect;
