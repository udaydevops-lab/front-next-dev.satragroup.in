"use client";

import React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { TextField } from "@mui/material";

export default function DateInput(props: any) {
  const handleDateChange = (date: any) => {
    props.onChange(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      {props.enableTime ? (
        <DateTimePicker
          className={props.className ? props.className : "cust-date-control relative w-full h-10"}
          disableFuture={props.disableFuture || false}
          label={props.label}
          disabled={props.disabled}
          value={props.value || null}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              variant: "outlined",
              error: false,
              InputProps: {
                classes: {
                  root: props.className, // Apply custom className here
                },
              },
            },
          }}
          format="DD/MM/YYYY HH:mm:ss" // Adjust the format as needed
        />
      ) : (
        <DatePicker
          className={props.className ? props.className : "cust-date-control relative w-full h-10 !rounded-[8px]"}
          label={props.label}
          disabled={props.disabled}
          value={props.value || null}
          onChange={handleDateChange}
          disableFuture={props.disableFuture}
          slotProps={{
            textField: {
              variant: "outlined",
              error: false,
              InputProps: {
                classes: {
                  root: props.className, // Apply custom className here
                },
              },
            },
          }}
          format="DD/MM/YYYY"
        />
      )}
    </LocalizationProvider>
  );
}
