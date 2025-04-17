"use client";
import { LabPagetitle } from "@/app/lab/_component";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PatientHeader from "./components/PatientHeader";
import Payment from "./components/Payment";
import {
  getBillingDetailsBybillId,
  getOpReceiptDetails,
  getPatientDetails,
  getPatientDetailsforPrint,
  getReceiptAmountsDataByBillNum,
  getReceptDataByBillNum,
  saveOpBillReceipt,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { toast } from "react-toastify";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import { getContent } from "../_components/Utils";
import { capitalize } from "@mui/material";
import ActionButton from "@/app/_common/button";

const BillNumberInfo = () => {
  const [showBalanceStatus, setShowBalanceStatus] = useState<any>(false);
  const [isDisabled, setIsDisabled] = useState<any>(false);
  const [billNoInfo, setBillNoInfo] = useState<any>();
  const [patientData, setPatientData] = useState<any>();
  const [paymentInfo, setPaymentInfo] = useState<any>([]);
  const { billId } = useParams();
  const header = getHeaderResponse();
  const [totalData, setTotalData] = useState({
    totalBillAmount: 0,
    totalDiscount: 0,
    itemsCancelledTotal: 0,
    amountToBePaid: 0,
    totalAmountPaid: 0,
    outStandingRefund: 0,
  });
  const [outStandingRefund, setOutStandingRefund] = useState(0);
  const [serviceResponseData, setServiceResponseData] = useState<any>({});
  const handleSearch = () => {
    services
      .get(getBillingDetailsBybillId + billId)
      .then((response1) => {
        let data = response1.data;
        let amountToBePaid = 0;
        setServiceResponseData(data);
        if (data.refundOrToBePaid <= 0) {
          setOutStandingRefund(-data.refundOrToBePaid);
        } else {
          amountToBePaid = data.refundOrToBePaid;
        }
        getPatientData(data.patientId, data.opdEncounterId);
        let arr1 = data.opBillingItemSet;
        let discount = 0;
        let cancelled = 0;
        let billAmount = 0;
        arr1.map((item: any) => {
          billAmount += item.serviceAmount;
          discount += item.discountAmount;
          if (item.cancelOpBill) {
            cancelled += item.finalAmount;
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
      })
      .catch((error) => {});
  };
  const [refundedAmount, setRefundedAmount] = useState(0.0);
  const [receiptDetails, setReceiptdetails] = useState<any>([]);
  const [paidAmount, setPaidAmount] = useState(0);
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

  // get pationt data gunction
  const getPatientData = async (patientid: any, opdEncounterId: any) => {
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
  const router = useRouter();
  const backEncounter = () => {
    router.back();
  };

  // const save function
  useEffect(() => {
    handleSearch();
    getReceiptDetails();
  }, []);
  return (
    <>
      <div className="top-0 w-full ">
        <div className="mx-auto mt-4  max-w-7xl pb-0">
          <div
            className="flex justify-between px-4"
          >
            {/* <Link href={"/lab/laboratory-worklist"}> */}
            <LabPagetitle
              title={`OP Receipt ${serviceResponseData?.billNumber}`}
            />
            <ActionButton
              buttonText={"Back"}
              width="w-[100px] py-2 bg-blue-700"
              handleSubmit={() => router.back()}
            />
          </div>
          <div className="bg-white p-2 px-4 rounded-md mt-3">
            <div className="w-full my-4">
              <PatientHeader
                patientData={patientData}
                billNoInfo={serviceResponseData}
              />
            </div>
            {/* <div>
              {getContent({
                totalBillAmount: totalData.totalBillAmount.toFixed(2),
                totalDiscount: totalData.totalDiscount.toFixed(2),
                itemsCancelledTotal: totalData.itemsCancelledTotal.toFixed(2),
                totalAmountPaid: paidAmount.toFixed(2),
                refundedAmount: refundedAmount.toFixed(2),
                amountToBePaid: totalData.amountToBePaid.toFixed(2),
              })}
            </div> */}
            <div className="w-full my-4 flex gap-4">
              <div>
                <span className="text-gray-800 font-semibold">
                  Total Bill Amount :{" "}
                </span>
                <span>{totalData?.totalBillAmount}</span>
              </div>
              {"|"}
              {/* <div>
                                <span className='text-gray-800 font-semibold'>Receipt Amount : </span>
                                <span>{billNoInfo?.receiptAmount}</span>
                            </div>{"|"} */}
              <div>
                <span className="text-gray-800 font-semibold">
                  Discount Amount :{" "}
                </span>
                <span>{totalData.totalDiscount.toFixed(2)}</span>
              </div>
              {"|"}
              <div>
                <span className="text-gray-800 font-semibold">
                  Cancelled Amount :{" "}
                </span>
                <span>{totalData.itemsCancelledTotal.toFixed(2)}</span>
              </div>
              {"|"}
              <div>
                <span className="text-gray-800 font-semibold">
                  Outstanding Amount :{" "}
                </span>
                <span>{totalData?.amountToBePaid}</span>
              </div>
            </div>
            <div className="w-full">
              <Payment
                paidAmount={paidAmount}
                totalData={totalData}
                outStandingAmount={totalData?.amountToBePaid}
                serviceResponseData={serviceResponseData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillNumberInfo;
