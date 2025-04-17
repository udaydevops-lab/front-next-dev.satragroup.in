"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

export default function ActionAlerts(props: any) {
  const [open, setOpen] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => {
      props.setAlertMsg(false);
    }, 10000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ width: '50%' }}>
      <Collapse in={open}>
        <Alert className={"cust-alert-wrap"}
          severity={props.severity ? props.severity : "success"}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                props.setAlertMsg(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {props.message}
        </Alert>
      </Collapse>
    </Box>
  );
}
