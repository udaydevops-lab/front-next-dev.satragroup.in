"use client"
import { getLabOrderDetails, getPatientDetails } from '@/app/utilities/api-urls';
import services from '@/app/utilities/services';
import moment from 'moment';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ResultPatientHeader = ({ patientData }: any) => {
  const getAge = (ageOfPatient: any) => {
    if (
      ageOfPatient?.match(/\d+ Years,\d+ Months and \d+ Days/)
    ) {
      const text = ageOfPatient;
      const numberRegex = /\d+ Years/;
      const monthRegex = /\d+ Months/;
      const dayRegex = /\d+ Days/;
      const dayMatch = text?.match(dayRegex);
      const monthMatch = text?.match(monthRegex);
      const matches = text?.match(numberRegex);
      let extractedNumber: any;
      if (matches && matches.length > 0 && parseInt(matches[0]) > 0) {
        extractedNumber = parseInt(matches[0]);
        let constCate = `${extractedNumber} Years`;
        return constCate;
      } else if (
        monthMatch &&
        matches.length > 0 &&
        parseInt(matches[0]) == 0 &&
        parseInt(monthMatch[0]) > 0
      ) {
        extractedNumber = parseInt(monthMatch[0]);
        let constCate = `${extractedNumber} Months`;
        return constCate;
      } else if (
        parseInt(monthMatch[0]) == 0 &&
        parseInt(matches[0]) == 0
      ) {
        extractedNumber = parseInt(dayMatch[0]);
        let constCate = `${extractedNumber} Days`;
        return constCate;
      }
    } else if (ageOfPatient == "") {
      return "";
    } else {
      return ageOfPatient + "Years";
    }
  }
  useEffect(() => {
  }, []);
  return (
    <div>
      <div className="!cust-t-g1 flex w-full py-1 px-3 text-sm text-blue-600 rounded-lg mb-2 bg-blue-gray-100">
        <span className="capitalize">
          {patientData.patientName}{" "}|{" "}
          {patientData?.MRN}{" "}|{" "}
          {patientData?.ageOfPatient ? getAge(patientData?.ageOfPatient) : ""}{" "}|{" "}
          {patientData?.genderDesc}{" "}|{" "}
          {patientData?.healthId}{" "}|
        </span>
        <span>
          {patientData?.abhaAddress ? patientData?.abhaAddress + "@sbx" : ""}
        </span>
      </div>
      <div className="!cust-t-g1 flex w-full py-1 px-3 text-sm text-blue-600 rounded-lg mb-2 bg-blue-gray-100">
        <span className="capitalize">
          {"Order ID : "} {patientData.orderId} |{" "}
          {"Order Date : "} {patientData.orderDateTime ? moment(patientData.orderDate).format("YYYY-MM-DD HH:mm") : ""} |{" "}
          {"OP BILL : "} {patientData.billNumber} |{" "}
          {"Ordered By : "} {patientData?.orderBy}
        </span>
      </div>
    </div>
  )
}

export default ResultPatientHeader