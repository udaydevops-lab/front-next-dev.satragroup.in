"use client";
import ActionButton from "@/app/_common/button";
import GenerateBillPrintLayout from "@/app/_common/PrintLayout/GenerateBillPrintLayout";
import OpReceiptPrintLayout from "@/app/_common/PrintLayout/OpReceipt";
import { ReactSelectBox } from "@/app/_commonfeatures";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { getPaymentColumns, initialFormData } from "./Utils";
import { capitalize } from "@mui/material";
import { toast } from "react-toastify";
import services from "@/app/utilities/services";
import { saveOpBillReceipt } from "@/app/utilities/api-urls";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import { getLocalItem } from "@/app/utilities/local";
import PrintReceipt from "./PrintReceipt";

// Define types for payment data

interface PaymentProps {
  outStandingAmount: any;
  serviceResponseData: any;
  totalData: any;
  paidAmount:any
}
const Payment: FC<PaymentProps> = ({
  outStandingAmount,
  serviceResponseData,
  totalData,
  paidAmount
}) => {
  const paymentTypeList: any = [
    { label: "Cash", value: "cash" },
    { label: "Cheque", value: "cheque" },
    { label: "Credit card", value: "creditCard" },
    { label: "Debit card", value: "debitCard" },
    { label: "Upi", value: "upi" },
  ];

  
  const [state, setState] = useState("cash");
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isPrintDisabled,setIsPrintDisabled]=useState(true)
  const [totalSummary, setTotalSummary] = useState({
    payableAmount: outStandingAmount,
    amountAdded: 0,
    outStandingAmount: 0,
  });
  // Functionality for the Apply button

  
  const columns: GridColDef[] = [
    { field: "id", headerName: "S.no", width: 120 },
    { field: "modeOfPayment", headerName: "Payment Mode", width: 200 },
    { field: "amount", headerName: "Amount", width: 120 },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <>
        {!isDeleteEnabled?
        <button
            className="text-center"
            onClick={
              () => {
                onDelete(params.row)
              }
              
            }
          >
            <TrashIcon className="text-red-500 w-5 h-5" />
          </button>:null}
        </>
      ),
    },
  ];
  const onDelete=(data:any)=>{
    let gridArray = [...formData.gridData];
    gridArray = gridArray.filter((item) => item.sNo!== data.sNo);
    let total = 0;
    gridArray.forEach((item) => (total += Number(item.amount)));
    setFormData({...formData, gridData: gridArray });
    if(total>0){
      setIsSaveDisabled(false)
    }else if(total<=0){
      setIsSaveDisabled(true)
    }
    setTotalSummary({
      payableAmount: outStandingAmount,
      amountAdded: total,
      outStandingAmount: outStandingAmount - total,
    });
    
  }
  // print data function
  const PrintRecord = () => {
    const printContent = document.getElementById("divToPrint");

    if (printContent) {
      const printWindow = window.open(
        "",
        "_blank",
        "width=1000,height=600,scrollbars=yes, toolbar=no,location=no,status=no,menubar=no"
      );

      if (printWindow) {
        printWindow.document.write(
          "<html><head><title>Print</title></head><body>"
        );
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };
  const [isDeleteEnabled,setIsDetleteEnabled]=useState(true)
  const handleAdd = () => {
    if (!formData[state].amount) {
      toast.error("Please enter amount");
      return;
    }
   if(formData[state].amount<0){
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
      modeOfPayment: formData.modeOfPayment.label,
      amount: formData[state].amount,
    };
    if (state == "creditCard" || state == "debitCard") {
      obj.cardName = formData[state].cardName;
      obj.cardNumber = formData[state].cardNumber;
      obj.expiryDate = formData[state].expiryDate;
      obj.cvv = formData[state].cvv;
      obj.transactionNumber = formData[state].transactionNumber;
    }
    if (state == "cheque" || state == "upi") {
      obj.referenceNumber = formData[state].referenceNumber;
    }
    let sum = 0;
    gridArray.forEach((item: any) => {
      sum += Number(item.amount);
    });
    let index = formData.gridData.findIndex(
      (item: any) => item.modeOfPayment === formData.modeOfPayment.label
    );
    if (index < 0) {
      if (sum + Number(obj.amount) > outStandingAmount) {
        toast.error("Receipt amount exceeds total outstanding amount");
        return;
      }
      gridArray.push(obj);
    } else {
      if (sum + Number(obj.amount) <= outStandingAmount) {
        gridArray[index].amount =
          Number(gridArray[index].amount) + Number(formData[state].amount);
        gridArray[index].sNo = gridArray.length + 1;
      } else {
        return toast.error("Receipt amount exceeds total outstanding amount");
      }
    }
    let sum1 = 0;
    gridArray.forEach((item: any) => {
      sum1 += Number(item.amount);
    });
    setIsSaveDisabled(sum1 == 0);
    setTotalSummary({
      ...totalSummary,
      amountAdded: sum1,
      outStandingAmount: outStandingAmount - sum1,
    });
    setFormData({ ...formData, gridData: gridArray });
    handleReset();
  };
  const [loader, setLoader] = useState(false);
  const header = getHeaderResponse();
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const handelSaveBill = () => {
    let arr = [...formData.gridData];
    let obj: any = {};
    let modeArr: any = [];
    arr.map((item: any) => {
      delete item.sNo;
      if (item.modeOfPayment.toLowerCase() == "cash") {
        obj.cash = item;
        modeArr.push("cash");
      } else if (item.modeOfPayment.toLowerCase() == "credit card") {
        obj.creditCard = item;
        modeArr.push("creditCard");
      } else if (item.modeOfPayment.toLowerCase() == "debit card") {
        obj.debitCard = item;
        modeArr.push("debitCard");
      } else if (item.modeOfPayment.toLowerCase() == "cheque") {
        obj.cheque = item;
        modeArr.push("cheque");
      }
    });
    let postObj: any = {
      generatedId: null,
      modeOfPayment: modeArr,
      paymentDetails: obj,
      receiptAmount: totalSummary.amountAdded,
      cancelAmount: totalData.itemsCancelledTotal,
      discountAmount: totalData.totalDiscount,
      outStandingAmount: totalSummary.outStandingAmount,
      billNumber: serviceResponseData.billNumber,
      patientId: serviceResponseData.patientId,
      encounterId: serviceResponseData.opdEncounterId,
    };
    setLoader(true);
    services
      .create(saveOpBillReceipt, [postObj], header)
      .then((responce) => {
        setTimeout(() => {
          setLoader(false);
          toast.success(responce.data ? responce.data : "success");
          setIsPrintDisabled(false)
          setIsSaveDisabled(true)
          setIsDetleteEnabled(false)
        }, 1000);
      })
      .catch((error: any) => {
        setLoader(false);
        setIsPrintDisabled(true)
        toast.error(
          error.response.data
            ? error?.response?.data
            : "something wrong, please try again"
        );
      });
  };
  const handleReset = () => {
    Object.keys(formData[state]).map((key: any, index: number) => {
      formData[state][key] = "";
    });
  };
  useEffect(() => {
    // handleReceipt();
  }, []);

  return (
    <>
      <div id="divToPrint" className="hidden w-full">
        <PrintReceipt
         tableData={formData.gridData}
         totalData={{
           totalBillAmount: totalData.totalBillAmount.toFixed(2),
           totalDiscount: totalData.totalDiscount.toFixed(2),
           paidAmount:paidAmount,
           receiptAmount: totalSummary.amountAdded.toFixed(2),
           outStandingAmount: totalSummary.outStandingAmount.toFixed(2),
         }}
         opdEncounterId={serviceResponseData.opdEncounterId}
         patientid={serviceResponseData.patientId}
         billNumber={serviceResponseData.billNumber}
        />
      </div>
       

      <div className="w-full grid grid-cols-2 gap-8 pt-2">
        <div>
          <div className="font-bold mb-1">Payment Mode</div>
          <div className="w-full">
            <ReactSelectBox
              value={formData.modeOfPayment}
              options={paymentTypeList}
              onChange={(e) => {
                setFormData({ ...formData, modeOfPayment: e });
                setState(e.value);
              }}
              label="Payment Type"
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
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
                    type="text"
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
              disabled={!isDeleteEnabled}
              handleSubmit={handleAdd}
            />
          </div>
          <div className="w-full data-grid-newThem mt-4">
            <ReactDatagrid rows={formData.gridData} columns={getPaymentColumns(onDelete,isDeleteEnabled)} />
          </div>
        </div>
        <div className="p-2">
          <div className="font-bold mb-1">Payment Summary</div>
          <div className="w-full py-3">
            <div className="w-full flex gap-4 justify-between pb-2">
              <span>Payable Amount</span>
              <span>{outStandingAmount}</span>
            </div>
            <div className="w-full flex gap-4 justify-between pb-2">
              <span>Receipt Amount</span>
              <span>{totalSummary.amountAdded}</span>
            </div>
            <div className="w-full flex gap-4 justify-between pb-2">
              <span>Outstanding Amount</span>
              <span>{totalSummary.outStandingAmount}</span>
            </div>
          </div>
          <div className="w-full flex gap-4 justify-end">
            <ActionButton
              buttonText={
                loader ? (
                  <div className="w-full flex justify-center items-center">
                    <div className="innerBtnloader"></div>
                  </div>
                ) : (
                  "Save"
                )
              }
              width="w-[120px] text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              handleSubmit={handelSaveBill}
              disabled={isSaveDisabled||loader}
            />
            <ActionButton
              buttonText="Print"
              width="w-[120px] text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={isPrintDisabled}
              handleSubmit={PrintRecord}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
