"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function SelectTextFields(props: any) {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": {
          m: "8px 0px",

          color: "black",
          textAlign: "start",
          width: props.width ? props.width : "100%",
        },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-select-currency"
          select
          required={props.required}
          variant="outlined"
          style={{ width: props.width }}
          label={props.label}
          name={props.name}
          disabled={props.disabled}
          value={props.value}
          helperText={props.helperText}
          onChange={props.handleChange}
          InputLabelProps={{
            shrink: props.shrink,
          }}
          InputProps={{
            readOnly: props.readOnly,
          }}
        >
          <MenuItem disabled selected value="">
            {props.defaultOption}
          </MenuItem>

          {props.listItems &&
            props.listItems.map((option: any, index: any) => (
              <MenuItem key={index} value={option[props.keyValue]}>
                {option[props.displayValue]}
              </MenuItem>
            ))}
        </TextField>
      </div>
    </Box>
  );
}
