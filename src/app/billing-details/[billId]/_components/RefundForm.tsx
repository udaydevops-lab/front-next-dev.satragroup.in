"use client";
import { ReactSelectBox } from "@/app/_commonfeatures";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { Input } from "@material-tailwind/react";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  getContent,
  getFormColumns,
  getOptions,
  getRecieptColumns,
  initialFormData,
} from "./Utils";
import { capitalize, Divider } from "@mui/material";
import ActionButton from "@/app/_common/button";
import { toast } from "react-toastify";
import services from "@/app/utilities/services";
import {
  getOpReceiptDetails,
  getReceiptAmountsDataByBillNum,
  getReceptDataByBillNum,
  opBillingInitiateRefund,
} from "@/app/utilities/api-urls";
import { useParams } from "next/navigation";
import { getLocalItem } from "@/app/utilities/local";
import { getHeaderResponse } from "@/app/_commonfeatures/header";

export default function RefundForm({
  setOpen,
  serviceResponseData,
  totalData,
  setTotalData,
  handleSearch,
  receiptDetails,
  outStandingRefund,
  paidAmount,
  getReceiptDetails,
  getRefundDetailsGrid
}: any) {
  const [state, setState] = useState("cash");
  const [formData, setFormData] = useState<any>(initialFormData);
  const { billId } = useParams();
  const [modeOfRufund, setModeOfRefund] = useState<any>([]);
  useEffect(() => {
    let arr: any = [];
    receiptDetails.map((item: any) => {
      let obj: any = {};
      if (item.mode.toLowerCase() == "credit card") {
        obj = {
          value: "creditCard",
          label: "Credit Card",
        };
      } else if (item.mode.toLowerCase() == "debit card") {
        obj = {
          value: "debitCard",
          label: "Debit Card",
        };
      } else {
        obj = {
          value: item.mode.toLowerCase(),
          label: capitalize(item.mode),
        };
      }
      arr.push(obj);
    });
    setModeOfRefund(arr);
  }, []);
  const handleAdd = () => {
    if (!formData[state].amount) {
      toast.error("Please enter amount");
      return;
    }
    if(formData[state].amount<=0){
      toast.error("Please enter valid amount");
      return;
     }
    if(isNaN(formData[state].amount)){
      toast.error("Please enter valid amount");
      return;
    }
    let gridArray = [...formData.gridData];
    let obj: any = {
      sNo: gridArray.length + 1,
      modeOfRefund: formData.modeOfRefund.label,
      amount: formData[state].amount,
      referenceNo: formData[state].referenceNo,
      approvalCode: formData[state].approvalCode,
    };
    if (formData[state] == "creditCard" || formData[state] == "debitCard") {
      obj.cardNumber = formData[state].cardNumber;
    }
    if (formData[state] == "cheque") {
      obj.checkNumber = formData[state].checkNumber;
    }
    let sum = 0;
    gridArray.forEach((item: any) => {
      sum += Number(item.amount);
    });
    let index = formData.gridData.findIndex(
      (item: any) => item.modeOfRefund === formData.modeOfRefund.label
    );
    let isLimitExceeded = false;

    if (index < 0) {
      if (sum + Number(obj.amount) > totalSummary.totalOutstanding) {
        toast.error("Refund amount exceeds total outstanding refund");
        return;
      }
      receiptDetails.map((item: any) => {
        if (
          item.mode.toLowerCase() == formData.modeOfRefund.label.toLowerCase()
        ) {
          if (Number(obj.amount) > Number(item.amount)) {
            isLimitExceeded = true;
          } else {
          }
        }
      });
      if (isLimitExceeded) {
        toast.error("Refund limit exceeds for this payment mode ");
        return;
      }
      gridArray.push(obj);
    } else {
      //Add ammount to same mode of refund if already added
      receiptDetails.map((item: any) => {
        if (
          item.mode.toLowerCase() == formData.modeOfRefund.label.toLowerCase()
        ) {
          if (
            Number(formData.gridData[index].amount) + Number(obj.amount) >
            Number(item.amount)
          ) {
            isLimitExceeded = true;
          }
        }
      });
      if (isLimitExceeded) {
        toast.error("Refund limit exceeds for this payment mode ");
        return;
      }
      if (sum + Number(obj.amount) <= totalSummary.totalOutstanding) {
        gridArray[index].amount =
          Number(gridArray[index].amount) + Number(formData[state].amount);
        gridArray[index].sNo = gridArray.length + 1;
      } else {
        return toast.error("Refund amount exceeds total outstanding refund");
      }
    }

    let sum1 = 0;
    gridArray.forEach((item: any) => {
      sum1 += Number(item.amount);
    });
    setTotalSummary({
      ...totalSummary,
      addedAmount: sum1,
      remainingOutstanding: totalSummary.totalOutstanding - sum1,
    });
    setFormData({ ...formData, gridData: gridArray });
    setIsRefundDisabled(false)
    handleReset();
  };
  const [totalSummary, setTotalSummary] = useState({
    totalOutstanding: outStandingRefund,
    addedAmount: 0,
    remainingOutstanding: 0,
  });
  const [isRefundDisabled, setIsRefundDisabled] = useState(true)
  const header = getHeaderResponse();
  const handleRefund = () => {
    setIsRefundDisabled(true)
    let arr = [...formData.gridData];
    let obj: any = {};
    let modeArr: any = [];
    arr.map((item: any) => {
      delete item.sNo;
      if (item.modeOfRefund.toLowerCase() == "cash") {
        obj.cash = item;
        modeArr.push("cash");
      } else if (item.modeOfRefund.toLowerCase() == "credit card") {
        obj.creditCard = item;
        modeArr.push("creditCard");
      } else if (item.modeOfRefund.toLowerCase() == "debit card") {
        obj.debitCard = item;
        modeArr.push("debitCard");
      } else if (item.modeOfRefund.toLowerCase() == "cheque") {
        obj.cheque = item;
        modeArr.push("cheque");
      } else if (item.modeOfRefund.toLowerCase() == "upi") {
        obj.cash = item;
        modeArr.push("upi");
      } 
    });
    let postObj: any = {
      opdRefundId: null,
      modeOfRefund: modeArr,
      paymentRefundDetails: obj,
      refundRecieptAmount: totalSummary.addedAmount,
      totalAmount: totalSummary.addedAmount,
      billNumber: serviceResponseData.billNumber,
      patientId: serviceResponseData.patientId,
      encounterId: serviceResponseData.opdEncounterId,
      statusFlag: 1,
      patientName: serviceResponseData.patientName,
      serviceEntityId: JSON.parse(getLocalItem("loginResponse")!)
        ?.serviceEntityId,
    };
    services
      .create(opBillingInitiateRefund, [postObj],header)
      .then((response: any) => {
        toast.success("Refund Successfull");
        setFormData(initialFormData);
        setOpen(false);
        handleSearch();
        getRefundDetailsGrid()
        getReceiptDetails()
      })
      .catch((err) => {
        console.log(err)
        setIsRefundDisabled(false)
        if (err.response.data.statusMessage) {
          toast.error(err.response.data.statusMessage);
        } else {
          toast.error("Technical Error");
        }
      });
  };

  const handleReset = () => {
    Object.keys(formData[state]).map((key: any, index: number) => {
      formData[state][key] = "";
    });
  };
  const handleRefundReset=() => {
    setFormData(initialFormData);
    setTotalSummary({
      totalOutstanding: outStandingRefund,
      addedAmount: 0,
      remainingOutstanding: 0,
    });
    handleReset();
  }
  useEffect(() => {
    handleReset();
  }, []);
  return (
    <div>
      <>
        <div className="top-0 w-full ">
          <div className=" max-w-7xl pb-0">
            <div className="bg-white  rounded-md">
              <div className="w-full flex text-sm gap-4">
                <div>
                  <span className="text-gray-800 font-semibold">
                    Bill Number :{" "}
                  </span>
                  {/* <span>{billNoInfo?.revenueAmount}</span>*/}
                  <span>{serviceResponseData.billNumber}</span>
                </div>
                {/* {"|"}
                <div>
                  <span className="text-gray-800 font-semibold">
                    Total Amount :{" "}
                  </span>
                  {/* <span>{billNoInfo?.receiptAmount}</span> */}
                {/* <span>{totalData.totalAmount}</span>
                </div> */}
                {"|"}
                <div>
                  <span className="text-gray-800 font-semibold">
                    Outstanding Refund Amount :{" "}
                  </span>
                  {/* <span>{billNoInfo?.discountAmount}</span> */}
                  <span>{totalSummary.totalOutstanding}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="font-semibold mt-4">Payment Details</div>
        <div className="mt-4">
          <div
            className={`w-1/2 data-grid-newThem h-[150px] ${
              formData.gridData.length < 4 ? "" : "overflow-y-scroll"
            } `}
          >
            <ReactDatagrid
              hideFooter
              rows={receiptDetails}
              columns={getRecieptColumns()}
            />
          </div>
        </div>
        <Divider />
        <div className="font-semibold mt-4">Refund Details</div>
        <div className="flex gap-6 mt-4">
          <div className="w-1/3">
            <div className="">
              <ReactSelectBox
                label="Mode of refund"
                value={formData.modeOfRefund}
                onChange={(e) => {
                  setFormData({ ...formData, modeOfRefund: e });
                  setState(e.value);
                }}
                options={modeOfRufund}
              />
            </div>
            <div className="font-semibold mt-3">
              {formData.modeOfRefund.label}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4">
              {Object.keys(formData[state]).map((key: any) => {
                return (
                  <div key={key}>
                    <Input
                      crossOrigin
                      value={formData[state][key]}
                      name={key}
                      onChange={(e: any) => {
                        let obj = { ...formData };
                        obj[state][key] = e.target.value;
                        setFormData(obj);
                      }}
                      type="number"
                      label={capitalize(key.replace(/([A-Z])/g, " $1").trim())}
                      color="blue"
                      containerProps={{
                        className: "!min-w-[0]",
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex justify-end">
              <ActionButton
                width="w-[120px] py-2 bg-blue-500"
                buttonText={"Add"}
                handleSubmit={handleAdd}
              />
            </div>
          </div>
          <div className="w-2/3">
            <div
              className={` data-grid-newThem h-[200px] ${
                formData.gridData.length < 4 ? "" : "overflow-y-scroll"
              } `}
            >
              <ReactDatagrid
                hideFooter
                rows={formData.gridData}
                columns={getFormColumns()}
              />
            </div>
            <Divider />
            <div className="flex justify-start mt-2">
              {getContent({
                totalOutstanding: totalSummary.totalOutstanding.toFixed(2),
                addedAmount: totalSummary.addedAmount.toFixed(2),
                remainingOutstanding:
                  totalSummary.remainingOutstanding.toFixed(2),
              })}
            </div>
            <div className="flex justify-end gap-4">
              <ActionButton
                width="w-[120px] py-2 bg-blue-500"
                buttonText={"Refund"}

                disabled={formData.gridData.length==0||isRefundDisabled}
                handleSubmit={handleRefund}
              />
              <ActionButton
                width="w-[120px] py-3 bg-blue-500"
                buttonText={"Reset"}
                handleSubmit={() => {
                  handleRefundReset();
                }}
              />
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
