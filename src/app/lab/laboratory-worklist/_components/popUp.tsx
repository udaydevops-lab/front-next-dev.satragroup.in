import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import Cross_Icon from "@/app/_common/common_icons/Cross_Icon";
import { PopUpProps, getDDValue } from "./utils";
import { toast } from "react-toastify";
import Textarea from "@/app/_common/text-area";
import services from "@/app/utilities/services";
import {
  cancelAcknowledge,
  updateCollectionStatus,
  updateRejectionStatus,
} from "@/app/utilities/api-urls";
import { getList } from "@/app/configuration/emp-master-creation/components/utils";
import { jsonParse } from "@/app/utilities/local";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";

const PopUp: React.FC<PopUpProps> = ({
  state,
  setState,
  getGridData,
  handleOpen,
  open,
  ...props
}) => {
  const [formData, setFormData] = useState<any>({
    outSourceLabName: "",
    reason: "",
    comment: "",
  });

  const [rejected, setRejected] = useState<boolean>(false);
  const [outSourced, setOutSourced] = useState<boolean>(false);
  const [reasonsList, setReasonsList] = useState<any>([]);
  const [outsourcedList, setOutsourcedList] = useState<any>([]);
  const getMasterData = () => {
    //Get Master Data
    getList("OutsourcedLabNames", setOutsourcedList)
    getList("ReasonForRejection", setReasonsList)
  };

  const onRecieve = () => {
    let postObj = {
      status: "Received",
      updatedBy: jsonParse("loginResponse").employeename,
      collectionId: state.collectionId,
      outSourceLabName: formData.outSourceLabName ? formData.outSourceLabName : "",
    };
    //On recieve Call
    services
      .create(updateCollectionStatus, postObj)
      .then((response) => {
        toast.success("Order Recieved Successfully");
        getGridData();
        handleOpen()
      })
      .catch((error) => {
        console.log(error);
        toast.error("Technical error");
      })
  };
  const onReject = () => {
    if (rejected && !formData.reason) {
      toast.error("Please Select Reason");
    } else {
      //On reject Call
      let postObj = {
        status: "Rejected",
        collectionId: state.collectionId,
        ourSourceLabName: formData.outSourceLabName,
        reason: formData.reason,
        comment: formData.comment ? formData.comment : "",
      };
      services
        .create(updateRejectionStatus, postObj)
        .then((response) => {
          toast.success("Order Rejected Successfully");
          getGridData();
          handleOpen()
        })
        .catch((error) => {
          console.log(error);
          toast.error("Technical error");
        });
    }
  };
  const onCancelAck = () => {
    //On cancel rejection/acknowledge Call
    let postObj = {
      collectionId: state.collectionId,
      ourSourceLabName: formData.outSourceLabName ? formData.outSourceLabName : "",
    };
    services
      .create(cancelAcknowledge, postObj)
      .then((response) => {
        toast.success("Order Cancelled Successfully");
        getGridData();
        handleOpen()
      })
      .catch((error) => {
        console.log(error);
        toast.error("Technical error");
      });
  };
  useEffect(() => {
    getMasterData();
  }, []);
  return (
    <>
      <Dialog size="xl" handler={() => { }} open={open}>
        <DialogHeader className=" justify-center">
          <div
            onClick={() => handleOpen()}
            className="w-[25px] h-[30px] absolute  -top-4 -right-2 cursor-pointer"
          >
            <Cross_Icon />
          </div>
        </DialogHeader>
        <DialogBody className="text-black text-[15px] pt-0">
          <div className="w-full data-grid-newThem">
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
              <Table className="rounded-lg" aria-label="table">
                <TableHead className="bg-[#2196F3]">
                  <TableRow>
                    <TableCell width={150}>Container Name</TableCell>
                    <TableCell width={50}>Specimen</TableCell>
                    <TableCell width={150}>Lab Order ID</TableCell>
                    <TableCell width={150}>Order Date & Time</TableCell>
                    <TableCell component="th" scope="row" width={150}>
                      Accession No.
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className="!text-left">
                      {state.containerName}
                    </TableCell>
                    <TableCell className="!text-left w-auto">
                      {state.specimen}
                    </TableCell>
                    <TableCell className="!text-left">
                      {state.labOrderId}
                    </TableCell>
                    <TableCell className="!text-left">{"24/05/2024"}</TableCell>
                    <TableCell className="!text-left">
                      {state.accessionNum}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="w-full flex  gap-6 mt-6">
            <div>
              <Checkbox
                checked={outSourced}
                onClick={() => setOutSourced(!outSourced)}
              />
              Sample Outsourced
            </div>

          </div>
          <div className="w-full">
            {outSourced ? (
              <div className="w-1/2">
                <ReactSelectBox
                  value={getDDValue(
                    outsourcedList,
                    formData.outSourceLabName
                  )}
                  options={outsourcedList}
                  onChange={(e: any) => {
                    setFormData({ ...formData, outSourceLabName: e.value });
                  }}
                  label={"Outsourced to(lab name)"}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="w-full mt-4">
            <div>
              <Checkbox
                checked={rejected}
                onClick={() => setRejected(!rejected)}
              />
              Rejected
            </div>
            {rejected ? (
              <div className="mt-2 h-full w-full flex gap-4">
                <div className="w-1/2">
                  <ReactSelectBox
                    value={getDDValue(reasonsList, formData.reason)}
                    options={reasonsList}
                    onChange={(e: any) => {
                      setFormData({ ...formData, reason: e.value });
                    }}
                    label={"Reason for Rejection"}
                  />
                </div>
                <div className="w-1/2">
                  <Textarea
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setFormData({ ...formData, comment: e.target.value });
                    }}
                    label="Comments"
                  />
                </div>

              </div>
            ) : null}
          </div>
          {/* <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <div>
                  <Checkbox
                    checked={outSourced}
                    onClick={() => setOutSourced(!outSourced)}
                  />
                  Sample Outsourced
                </div>
              </div>
              {outSourced ? (
                <div>
                  <ReactSelectBox
                    value={getDDValue(
                      outsourcedList,
                      formData.outSourceLabName
                    )}
                    options={outsourcedList}
                    onChange={(e: any) => {
                      setFormData({ ...formData, outSourceLabName: e.value });
                    }}
                    label={"Outsourced to(lab name)"}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="">
                <div>
                  <Checkbox
                    checked={rejected}
                    onClick={() => setRejected(!rejected)}
                  />
                  Rejected
                </div>
              </div>
              {rejected ? (
                <div>
                  <ReactSelectBox
                    value={getDDValue(reasonsList, formData.reason)}
                    options={reasonsList}
                    onChange={(e: any) => {
                      setFormData({ ...formData, reason: e.value });
                    }}
                    label={"Reason for Rejection"}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            {rejected ? (
              <div className="mt-6 h-full">
                <div className="">
                  <Textarea
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setFormData({ ...formData, comment: e.target.value });
                    }}
                    label="Comments"
                  />
                </div>
              </div>
            ) : null}
          </div> */}

          <div className="w-full flex justify-end gap-3 mt-3">
            {props?.screenData?.Save === 1 &&
              <div className="w-auto newBtn-theme">
                <ActionButton
                  disabled={rejected}
                  buttonText="Receive"
                  handleSubmit={onRecieve}
                  width="w-full text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
              </div>
            }
            {props?.screenData?.Delete === 1 &&
              <div className="w-auto newBtn-theme">
                <ActionButton
                  disabled={!rejected}
                  buttonText="Reject"
                  handleSubmit={onReject}
                  width="w-full text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
              </div>
            }
            {/* Cancel the Received or Rejected status, 
            This is allowed as long as the result is not entered for any test of the accession number */}
            <div className="w-auto newBtn-theme">
              <ActionButton
                handleSubmit={onCancelAck}
                buttonText="Cancel Ack/Rej"
                width="w-full text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
            </div>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default roleInfoScreenData(PopUp, "LW")