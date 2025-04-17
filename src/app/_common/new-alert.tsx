import React from "react";
import { Alert, Button } from "@material-tailwind/react";

export default function AlertCustomAnimation(props: any) {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Alert
        className="cust-alerts"
        color={props.color}
        open={open}
        onClose={() => {
          props.setAlertMsg(false);
          setOpen(false);
        }}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
      >
        {props.message}
      </Alert>
    </>
  );
}
