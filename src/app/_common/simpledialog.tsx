"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ActionButton from "./button";

export interface SimpleDialogProps {
  modalTitleRequired: boolean;
  modalFooterRequired: boolean;
  handleSubmit: () => void;
  onClose: (value: boolean) => void;
  modalActionText: string;

  borderRadius: number;

  open: boolean;
  disableWidth: boolean;
  modalTitle: string;
  isNotRequiredCancelIcon: boolean;
  background: string;
  backgroundColor: string;
  maxWidth: string | number;
  backgroundImage: string;
  padding: string;
  paddingTop: number;
  buttonFooter: React.ReactNode;
  modalTitleCenter: boolean;
  editstyle: SimpleDialogProps;
  modalContent: React.ReactNode;
}

const SimpleDialog: React.FC<SimpleDialogProps> = (props) => {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      aria-describedby="alert-dialog-description"
      open={open}
      onClose={() => handleClose()}
    >
      {props.modalTitleRequired ? (
        <DialogTitle>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ padding: "5px 0px 0px" }}>{props.modalTitle}</div>
            <div>
              {props.isNotRequiredCancelIcon ? null : (
                <IconButton
                  aria-label="close"
                  style={{ color: "#fff" }}
                  onClick={() => {
                    props.onClose(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          </div>
        </DialogTitle>
      ) : (
        " "
      )}
      <DialogContent
        style={{
          background: props.background,
          backgroundColor: props.backgroundColor,
          maxWidth: props.maxWidth,
          backgroundImage: props.backgroundImage,
          padding: props.padding,
          paddingTop: props.paddingTop ? props.paddingTop : 10,
        }}
      >
        <DialogContentText id="alert-dialog-description">
          {props.modalContent}
        </DialogContentText>
      </DialogContent>
      {props.modalFooterRequired ? (
        <div>
          <DialogActions>
            {props.buttonFooter ? (
              <div>
                {" "}
                <ActionButton
                  buttonText={props.modalActionText}
                  handleSubmit={props.handleSubmit}
                  backgroundColor={"#ef6406"}
                  color="white"
                  border={"none"}
                  width="120px"
                />
              </div>
            ) : (
              ""
            )}
          </DialogActions>
        </div>
      ) : (
        ""
      )}
    </Dialog>
  );
};

export default SimpleDialog;
