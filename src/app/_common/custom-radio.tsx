import React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
export default function RadioButtonsGroup(props: any) {
  return (
    <FormControl component="fieldset">
      <RadioGroup
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        style={{
          color: props.color,
          backgroundColor: props.backgroundColor,
          fontWeight: props.fontWeight,
          textAlign: props.textAlign,
        }}
        defaultValue={props.defaultValue}
      >
        <div style={{ display: props.display }}>
          {props.listItems.map((row: any, index: number) => (
            <FormControlLabel
              value={row.id}
              key={index}
              control={
                <Radio
                  {...props.register}
                  disabled={props.disabled ? true : false}
                />
              }
              label={row.name}
            />
          ))}
        </div>
      </RadioGroup>
    </FormControl>
  );
}
