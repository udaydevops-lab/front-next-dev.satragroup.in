"use client";

import * as React from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

export default function CheckboxMui(props: any) {
  return (
    <FormGroup>
      <FormControlLabel
        disabled={props.disabled}
        control={
          <Checkbox
            {...props.inputRef}
            checked={props.checked ? props.checked : false}
            onChange={props.handleChange}
            size={props.size}
            sx={{
              color: props.color ? props.color : "none",
              "& .MuiSvgIcon-root": { fontSize: props.fontSize },
            }}
          />
        }
        label={props.label}
      />
    </FormGroup>
  );
}
