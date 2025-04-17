"use client"

import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";


export default function TransitionAlerts(props:any) {
  const [open, setOpen] = React.useState(true);

  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity={props.status || "success"}>{props.message}</Alert>
    </Stack>
  );
}
