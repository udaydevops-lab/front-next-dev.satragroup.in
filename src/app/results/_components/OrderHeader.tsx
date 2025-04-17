"use client";
import { getPatientDetails } from "@/app/utilities/api-urls";
import React, { useEffect, useState } from "react";
import UseCustomHook from "../customhook/useCustomHook";

function OrderHeader(props: any) {
  const { patientD, getPatientData } = UseCustomHook();
  useEffect(() => {
    getPatientData(
      `${getPatientDetails}${props.rowData.patientId}/${props.rowData.opdEncounterId}`
    );
  }, [props.rowData]);

  return (
    <>
      <div className="w-full">
        <div className="!cust-t-g1 flex w-full py-1 px-3 text-sm text-blue-600 rounded-lg mb-2 bg-blue-gray-100">
          <span className="capitalize">
            {patientD?.middleName} | {patientD?.mrn}{" "}
            {patientD?.genderDesc ? "|" : " "} {patientD?.genderDesc}{" "}
            {patientD?.ageOfPatient ? "|" : " "} {patientD?.ageOfPatient}{" "}
            {patientD?.healthId ? "|" : " "} {patientD?.healthId}
          </span>
        </div>
        <div className="!cust-t-g1 flex w-full py-1 px-3 text-sm text-blue-600 rounded-lg mb-4 bg-blue-gray-100">
          <span className="capitalize">
            Order Id: {props.rowData?.orderId} | Order Date:{" "}
            {props.rowData?.requestdate} {props.rowData?.billNumber ? "|" : " "}{" "}
            Bill: {props.rowData?.billNumber}{" "}
            {props.rowData?.recordedBy ? "|" : " "} Order By:{" "}
            {props.rowData?.recordedBy}
          </span>
        </div>
      </div>
    </>
  );
}

export default OrderHeader;
