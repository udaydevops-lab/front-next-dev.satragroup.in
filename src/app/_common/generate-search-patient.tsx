import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

function GenerateSearchPatient(props: any) {
  return (
    <>
      <Dialog
        open={props.open}
        handler={() => props.setOpen(false)}
        size={props.size}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="dialog-header relative">
          {props.header}
          Patient Search
          <div
            className="cursor-pointer absolute  top-3 right-4  z-30"
            onClick={() => props.setOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </DialogHeader>
        <DialogBody className="custom-model">{props.content}</DialogBody>
      </Dialog>
    </>
  );
}

export default GenerateSearchPatient;
