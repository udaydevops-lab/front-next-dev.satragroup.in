'use client'
import React from "react";
import { Button } from "@material-tailwind/react";

interface ActionButtonProps {
  buttonText: any;
  width?: string;
  backgroundColor?: string;
  color?: "gray" | "blue" | "green" | "red" | "yellow" | "indigo" | "purple" | "pink" | "white";
  height?: string;
  borderRadius?: string;
  border?: string;
  fontSize?: string;
  boxShadow?: string;
  fontWeight?: string;
  backgroundImage?: string;
  handleChange?: () => void;
  handleSubmit?: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const {
    buttonText,
    width,
    backgroundColor,
    color,
    height,
    border,
    borderRadius,
    fontSize,
    boxShadow,
    fontWeight,
    backgroundImage,
    handleChange,
    handleSubmit,
    disabled,
  } = props;

  return (
    <Button
      size="sm"
      color={props.color ? props.color : "blue"}
      className={`
        ${width}
        capitalize
        ${color}
        ${height}
        ${borderRadius}
        ${fontSize}
        ${border}
        ${boxShadow}
        ${fontWeight}
        ${backgroundImage}
        hover:bg-blue-gray
        focus:outline-none
        focus:ring
        focus:border-blue-300
        disabled:opacity-50
        disabled:pointer-events-none
      `}
      onClick={handleSubmit}
      disabled={disabled}
    >
      {buttonText}
    </Button>
  );
};

export default ActionButton;
