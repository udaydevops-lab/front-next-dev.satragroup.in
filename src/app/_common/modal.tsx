'use client'
import React from "react";
import SimpleDialog, { SimpleDialogProps } from "./simpledialog";

interface CustomModalProps {
  modalTitleRequired: boolean;

  modalFooterRequired?: boolean;
  handleSubmit?: (() => void | undefined);
  modalActionText?: string;


  open: boolean;
  onClose: (value: boolean) => void;
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

const CustomModal: React.FC<CustomModalProps> = (props) => {
  return (
    <div>
      <SimpleDialog
        modalContent={props.modalContent}
        modalTitleRequired={props.modalTitleRequired}
        modalFooterRequired={props.modalFooterRequired ? props.modalFooterRequired : false}
        handleSubmit={props.handleSubmit || (() => { })}
        modalActionText={props.modalActionText ? props.modalActionText : ''}
        open={props.open}
        onClose={props.onClose}
        disableWidth={props.disableWidth}
        modalTitle={props.modalTitle}
        isNotRequiredCancelIcon={props.isNotRequiredCancelIcon}
        background={props.background}
        backgroundColor={props.backgroundColor}
        maxWidth={props.maxWidth}
        backgroundImage={props.backgroundImage}
        padding={props.padding}
        paddingTop={props.paddingTop}
        buttonFooter={props.buttonFooter}
        modalTitleCenter={props.modalTitleCenter}
        editstyle={props.editstyle} 
        borderRadius={0}      />
    </div>
  );
};

export default CustomModal;
