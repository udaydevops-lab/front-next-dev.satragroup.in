"use client";
import { getOrderIdDetails, getPatientDetails } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function OrderDetails() {
  const [orderData, setOrderData] = useState<any>({})
  const { patientid,orderId } = useParams();
  const getPatientData = async () => {
    const data = await services.get(
      getOrderIdDetails + orderId 
    );
    setOrderData(data.data[0]);
  };
  useEffect(() => {
    getPatientData();
  }, []);
  return (
    <div>
      <div className="cust-t-g1 w-full py-1 px-3 text-sm text-blue-600 rounded-lg ">
        <span className="capitalize">
          {orderData?.fullName} | {orderData?.mrn} |{" "}
          {orderData?.genderDesc} | {orderData?.ageOfPatient}{" "}
          {orderData?.healthId ? "|" : ""} {orderData?.healthId}{" "}
          {orderData?.abhaAddress ? "|" : ""} {orderData?.abhaAddress}
        </span>
      </div>
      <div className="cust-t-g2 w-full py-1 px-3 text-sm text-blue-600 rounded-lg my-2 ">
        <span className="capitalize">
          {"Order ID : "} {orderData.orderId} |{" "}
          {"Order Date : "} {orderData.generatedDate} |{" "}
          {"OP BILL : "} {orderData.billNumber} |{" "}
          {"Ordered By : "} {orderData?.doctor}
        </span>
      </div>
    </div>
  );
}
