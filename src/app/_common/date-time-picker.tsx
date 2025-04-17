"use client";
import * as React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";

const DateTime = (props: any) => {
  const handleDateChange = (date: any) => {
    props.onChange(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DemoContainer components={["DateTimePicker"]}>
        <DateTimePicker
          className={"cust-date-control"}
          label={props.label}
          value={props.value}
          onChange={handleDateChange}
          disabled={props.disabled}
          slotProps={{
            actionBar: {
              actions: ["today", "accept"],
            },
            textField: {
              error: false,
            },
          }}
          maxDate={props.maxDate}
          minDate={props.minDate}
          format="DD/MM/YYYY hh:mm a"
          disableFuture={props.disableFuture}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DateTime;
