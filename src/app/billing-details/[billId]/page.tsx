"use client";
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import { ReactSelectBox } from "@/app/_commonfeatures";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import {
  getBillingDetailsBybillId,
  getBillStatus,
  getOpReceiptDetails,
  getPatientDetailsforPrint,
  getReceiptAmountsDataByBillNum,
  getRefundGridData,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { capitalize, Checkbox, Divider } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { error } from "console";
import React, { useEffect, useState } from "react";
import {
  assignValues,
  getContent,
  getRefundDetailsColumns,
  initialCancelData,
  isCheckBoxEnabled,
} from "./_components/Utils";
import { Input } from "@material-tailwind/react";
import Buttons from "./_components/ButtonsSection";
import { useParams, useRouter } from "next/navigation";
import PatientHeaderBillDetails from "./_components/PatientHeader";
import PrintBillDetails from "./_components/PrintBillDetails";
import OpReceiptPrintLayout from "@/app/_common/PrintLayout/OpReceipt";
export default function BillDetails() {
  const [totalData, setTotalData] = useState({
    totalBillAmount: 0,
    totalDiscount: 0,
    itemsCancelledTotal: 0,
    amountToBePaid: 0,
    totalAmountPaid: 0,
    outStandingRefund: 0,
  });
  const { billId } = useParams();
  const [cancelAmount, setCancelAmount] = useState(0);
  const [cancelData, setCancelData] = useState(initialCancelData);
  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 50 },
    {
      field: "serviceName",
      headerName: "Service Name",
      width: 250,
    },
    {
      field: "serviceTypeDesc",
      headerName: "Service Type",
      width: 180,
    },
    {
      field: "serviceAmount",
      headerName: "Bill Amount",
      width: 150,
    },
    {
      field: "discountAmount",
      headerName: "Discount",
      width: 180,
    },
    {
      field: "finalAmount",
      headerName: "Net Amount",
      width: 130,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
    },
    {
      field: "item",
      headerName: "Select Item",
      width: 130,
      renderCell: (params: any) => (
        <div
          className={`${
            params.row.checkBoxDisabled||!isCheckBoxEnabled(params.row)
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          <Checkbox
            onChange={() => handleCheckbox(params.row)}
            disabled={params.row.checkBoxDisabled||!isCheckBoxEnabled(params.row)}
            checked={params.row.cancelOpBill}
          />
        </div>
      ),
    },
  ];
  const handleCheckbox = (data1: any) => {
    const index = gridData.findIndex((item: any) => item.id == data1.id);
    let arr = [...gridData];
    arr[index].cancelOpBill = !data1.cancelOpBill;
    let sum = 0;
    arr.map((item: any) => {
      if (item.cancelOpBill && !item.checkBoxDisabled) {
        sum += item.finalAmount;
      }
    });
    const cancelObjects = gridData.filter(
      (item: any) => item.cancelOpBill && !item.checkBoxDisabled
    );
    let arr1: any = [];
    cancelObjects.map((item: any) => {
      let obj = assignValues(item);
      arr1.push(obj);
    });
    let obj = { ...cancelData };
    obj.billHeaderId = serviceResponseData.billHeaderId;
    obj.patientId = serviceResponseData.patientId;
    obj.opdEncounterId = serviceResponseData.opdEncounterId;
    obj.billNumber = serviceResponseData.billNumber;
    obj.totalAmount = sum;
    obj.opBillingItemSet = arr1;
    setCancelAmount(sum);
    setGridData(arr);
    setCancelData(obj);
  };
  const [patientData, setPatientData] = useState<any>();
  const [serviceResponseData, setServiceResponseData] = useState<any>({});
  const [gridData, setGridData] = useState<any>([]);
  const getPatientData = async (patientid: any, opdEncounterId: any) => {
    console.log("parddd",patientid,opdEncounterId)
    try {
      const data = await services.get(
        `${getPatientDetailsforPrint}${patientid}/${opdEncounterId}`
      );
      // console.log(data.data[0]);
      setPatientData(data.data[0]);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const handleSearch = async () => {
   await services
      .get(getBillingDetailsBybillId + billId)
      .then(async(response1) => {
        let data = response1.data;
        let amountToBePaid = 0;
        setServiceResponseData(data);
        if (data.refundOrToBePaid <= 0) {
          setOutStandingRefund(-data.refundOrToBePaid);
        } else {
          amountToBePaid = data.refundOrToBePaid;
        }
        await getPatientData(data.patientId, data.opdEncounterId);
        let arr1 = data.opBillingItemSet;
        let discount = 0;
        let cancelled = 0;
        let billAmount = 0;
        services
          .get(getBillStatus + billId)
          .then((response2) => {
            arr1.map((item: any, index: number) => {
              item.id = index + 1;
              billAmount += item.serviceAmount;
              discount += item.discountAmount;
              if (item.cancelOpBill) {
                cancelled += item.finalAmount;
              }
              response2.data.map((item1: any, index1: number) => {
                if (item.orderId == item1.orderId) {
                  let obj = {
                    ...item,
                    checkBoxDisabled: item.cancelOpBill ? true : false,
                    status: item1.status,
                  };
                  arr1[index] = obj;
                }
              });
              setTotalData({
                ...totalData,
                outStandingRefund: data.outStandingRefund,
                totalBillAmount: billAmount,
                totalDiscount: discount,
                itemsCancelledTotal: cancelled,
                amountToBePaid: amountToBePaid,
              });
            });
            setGridData(arr1);
            setCancelAmount(0)
          })
          .catch((err) => {
            setGridData(arr1);
          });
      })
      .catch((error) => {
        setGridData([]);
      });
  };
  const [refundedAmount, setRefundedAmount] = useState(0.0);
  const [receiptDetails, setReceiptdetails] = useState<any>([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [outStandingRefund, setOutStandingRefund] = useState(0);
  const getReceiptDetails = () => {
    services
      .get(`${getReceiptAmountsDataByBillNum}billNum=${billId}`)
      .then((response) => {
        let data = response.data.opBillingReceiptDto;
        let arr: any = [];
        data.map((item: any) => {
          Object.keys(item.paymentDetails).map((key: any) => {
            let obj: any = {};
            obj.mode = capitalize(key);
            obj.amount = item.paymentDetails[key].amount;
            let index = arr.findIndex(
              (item: any) => item.mode.toLowerCase() === key
            );
            if (index < 0) {
              arr.push(obj);
            } else {
              arr[index].amount =
                Number(arr[index].amount) +
                Number(item.paymentDetails[key].amount);
            }
          });
        });
        setReceiptdetails(arr);
        let total = 0;
        arr.map((item: any) => {
          total += Number(item.amount);
        });
        setPaidAmount(total);
      });
  };
  const router = useRouter();
  const [refundDetailsGrid, setRefundDetailsGrid] = useState<any>([]);
  const getRefundDetailsGrid = () => {
    services
      .get(`${getRefundGridData}billNumber=${billId}`)
      .then((response) => {
        let data = response.data;
        let arr: any = [];
        let sum = 0;
        data.map((item: any, index: number) => {
          let str = item.modeOfRefund.join(",");
          sum += item.totalAmount;
          let obj = {
            id: index + 1,
            amount: item.totalAmount,
            modeOfRefund: str,
            generatedDate: item.generatedDate,
            patientName: item.patientName,
            billNumber: item.billNumber,
            generatedBy:item.generatedBy
          };
          arr.push(obj);
        });
        setRefundedAmount(sum);
        setRefundDetailsGrid(arr);
      })
      .catch((error) => {
        setRefundedAmount(0);
        console.log(error.message);
      });
  };
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
  useEffect(() => {
    handleSearch();
    getReceiptDetails();
    getRefundDetailsGrid();
  }, []);
  return (
    <div className="min-h-full ">
      <div className="font-bold px-4 mt-4 flex justify-between md:pt-3 pb-3  max-w-7xl mx-auto w-full">
        <h1>{"OP Bill Details"}</h1>
        <div onClick={() => router.back()}>
          {/* <Link href={"/lab/laboratory-worklist"}> */}
          <span className="cursor-pointer text-white  text-[14px] py-2 px-6 rounded-lg  bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]">
            Back
          </span>
        </div>
      </div>
    {serviceResponseData.patientId&&<div id="divToPrint" className="hidden w-full">
    <PrintBillDetails
      tableData={gridData}
      totalData={{
        totalBillAmount: totalData.totalBillAmount.toFixed(2),
        totalDiscount: totalData.totalDiscount.toFixed(2),
        itemsCancelledTotal: totalData.itemsCancelledTotal.toFixed(2),
        totalAmountPaid: paidAmount.toFixed(2),
        refundedAmount: refundedAmount.toFixed(2),
        amountToBePaid: totalData.amountToBePaid.toFixed(2),
        outStandingRefund: outStandingRefund.toFixed(2),
      }}
      opdEncounterId={serviceResponseData.opdEncounterId}
      patientid={serviceResponseData.patientId}
      billNumber={billId}
    />
    </div>}
      <div className="px-4 md:pt-3 pb-3  max-w-7xl mx-auto w-full bg-white rounded-[12px] shadow-[0_3px_6px_#00000029]">
        <div className="w-full ">
          <PatientHeaderBillDetails
            patientData={patientData}
            billNoInfo={serviceResponseData}
          />
        </div>
        <div>
          <div className="">
            <div className="data-grid-newThem mt-4">
              <ReactDatagrid hideFooter rows={gridData} columns={columns} />
            </div>
            <div className="flex justify-between gap-5 me-20">
              <div className="mt-9">
                {getContent({
                  totalBillAmount: totalData.totalBillAmount.toFixed(2),
                  totalDiscount: totalData.totalDiscount.toFixed(2),
                  itemsCancelledTotal: totalData.itemsCancelledTotal.toFixed(2),
                  totalAmountPaid: paidAmount.toFixed(2),
                  refundedAmount: refundedAmount.toFixed(2),
                  amountToBePaid: totalData.amountToBePaid.toFixed(2),
                  outStandingRefund: outStandingRefund.toFixed(2),
                })}
              </div>
              <div className="flex gap-4 mt-6">
                <div className="mt-3">
                  <h1 className="font-semibold text-sm">Cancel Amount</h1>
                </div>
                <div className="w-[150px]">
                  <Input
                    crossOrigin
                    value={cancelAmount}
                    type="text"
                    label="Total"
                    color="blue"
                    readOnly
                    containerProps={{
                      className: "!min-w-[0]",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <Buttons
          PrintRecord={PrintRecord}
            cancelAmount={cancelAmount}
            paidAmount={paidAmount}
            outStandingRefund={outStandingRefund}
            handleSearch={handleSearch}
            cancelData={cancelData}
            totalData={totalData}
            getReceiptDetails={getReceiptDetails}
            getRefundDetailsGrid={getRefundDetailsGrid}
            setTotalData={setTotalData}
            receiptDetails={receiptDetails}
            serviceResponseData={serviceResponseData}
          />
        </div>
        {refundDetailsGrid.length > 0 && (
          <div className="mt-8">
            <Divider />
            <div className="font-bold mt-4">Refund details</div>
            <div className="data-grid-newThem mt-4">
              <ReactDatagrid
                rows={refundDetailsGrid}
                columns={getRefundDetailsColumns()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
