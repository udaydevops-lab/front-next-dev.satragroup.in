import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function DialogueBox(props: any) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (props.closepopup == false) {
      setOpen(!open);
    }
  }, [props.closepopup]);
  return (
    <>
      {props.icon ? (
        <div onClick={handleOpen} className="cursor-pointer">
          {props.icon}
        </div>
      ) : (
        <>
          {props.labelText ? (
            <div
              className={props.className}
              onClick={props.handleOpen ? props.handleOpen : handleOpen}
            >
              {props.labelText}
            </div>
          ) : (
            <Button
              className={props.className}
              onClick={props.handleOpen ? props.handleOpen : handleOpen}
              variant="gradient"
              color={props.buttonColor}
              size={props.btnsize}
              disabled={props.disable}
            >
              {props.label}
            </Button>
          )}
        </>
      )}
      <Dialog
        open={open}
        size={props.size}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>{props.header}</DialogHeader>
        <DialogBody
          style={{ maxHeight: "570px", overflowY: "auto", overflowX: "auto" }}
          className={props.classNameDialogue}
        >
          <span
            onClick={handleClose}
            className="text-right absolute right-5 top-0 cursor-pointer	"
          >
            X
          </span>
          {props.content}
        </DialogBody>
      </Dialog>
    </>
  );
}
