"use client"

import React from "react";
import { Backdrop, CircularProgress, Button } from "@mui/material";

export default function SimpleBackdrop(props:any) {
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
