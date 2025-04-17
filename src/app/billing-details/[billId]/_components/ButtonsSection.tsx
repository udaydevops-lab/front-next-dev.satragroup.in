"use client";
import ActionButton from "@/app/_common/button";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import React, { useEffect, useState } from "react";
import ConfirmPop from "./ConfirmPop";
import RefundForm from "./RefundForm";
import { toast } from "react-toastify";
import services from "@/app/utilities/services";
import { cancelOpBillServices } from "@/app/utilities/api-urls";
import { useParams, useRouter } from "next/navigation";

export default function Buttons({
  totalData,
  setTotalData,
  cancelData,
  handleSearch,
  serviceResponseData,
  receiptDetails,
  outStandingRefund,
  paidAmount,
  cancelAmount,
  getReceiptDetails,
  getRefundDetailsGrid,
  PrintRecord
}: any) {
  const [open, setOpen] = useState(false);
  const [popUpTitle, setPopUpTitle] = useState("Confirm");
  const [popUpSize, setPopUpSize] = useState<any>("md");
  const { billId } = useParams();
  const router = useRouter();
  const handleYes = () => {
    services
      .create(cancelOpBillServices, cancelData)
      .then((response) => {
        toast.success("Items cancelled successfully");
        handleSearch();
        setPopUpContent(
          <RefundForm
            getRefundDetailsGrid={getRefundDetailsGrid}
            getReceiptDetails={getReceiptDetails}
            outStandingRefund={outStandingRefund}
            paidAmount={paidAmount}
            receiptDetails={receiptDetails}
            handleSearch={handleSearch}
            setOpen={setOpen}
            serviceResponseData={serviceResponseData}
            setTotalData={setTotalData}
            totalData={totalData}
          />
        );
        setPopUpTitle("OP Refund");
        setOpen(false);
      })
      .catch((error) => {
        if (error.response.data.statusMessage) {
          toast.error(error.response.data.statusMessage);
        }
      });
  };
  const [popUpContent, setPopUpContent] = useState(
    <ConfirmPop handleYes={handleYes} handleNo={() => setOpen(false)} />
  );
  const handleClose = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setPopUpContent(
      <ConfirmPop handleYes={handleYes} handleNo={() => setOpen(false)} />
    );
    setPopUpSize("md");
    setPopUpTitle("Confirm");
    setOpen(true);
  };
  const handleRefund = () => {
    setPopUpContent(
      <RefundForm
        getRefundDetailsGrid={getRefundDetailsGrid}
        getReceiptDetails={getReceiptDetails}
        outStandingRefund={outStandingRefund}
        paidAmount={paidAmount}
        receiptDetails={receiptDetails}
        handleSearch={handleSearch}
        setOpen={setOpen}
        serviceResponseData={serviceResponseData}
        setTotalData={setTotalData}
        totalData={totalData}
      />
    );
    setPopUpTitle("OP Refund");
    setPopUpSize("lg");
    setOpen(true);
  };
  useEffect(() => {}, []);
  return (
    <div>
      <div className="flex justify-end gap-4">
        <ActionButton
          buttonText="New Receipt"
          width="w-[120px] text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          disabled={totalData.amountToBePaid == 0}
          handleSubmit={() => {
            router.push(`/billing-details/${billId}/new`);
          }}
        />
        <ActionButton
          buttonText="Refund"
          width="w-[120px] text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          disabled={outStandingRefund <= 0}
          handleSubmit={() => {
            handleRefund();
          }}
        />
        <ActionButton
          buttonText="Cancel Item(s)"
          width="w-[130px] text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          disabled={cancelAmount == 0}
          handleSubmit={() => {
            handleCancel();
          }}
        />
        <ActionButton
          buttonText="Print"
          width="w-[120px] text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          handleSubmit={() => PrintRecord()}
        />
        {/* <ActionButton
          buttonText="Clear"
          width="w-[120px] py-3 bg-blue-500"
          handleSubmit={() => {}}
        /> */}
      </div>
      <div>
        <ReactCommonDialog
          Content={popUpContent}
          open={open}
          size={popUpSize}
          popupClose={handleClose}
          dialogtitle={popUpTitle}
          handler={() => {}}
        />
      </div>
    </div>
  );
}
