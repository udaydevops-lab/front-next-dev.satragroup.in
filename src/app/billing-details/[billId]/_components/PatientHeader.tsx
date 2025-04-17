"use client";
import moment from "moment";
import React from "react";

const PatientHeaderBillDetails = ({ patientData, billNoInfo }: any) => {
  const getAge = (ageOfPatient: any) => {
    if (ageOfPatient?.match(/\d+ Years,\d+ Months and \d+ Days/)) {
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
      } else if (parseInt(monthMatch[0]) == 0 && parseInt(matches[0]) == 0) {
        extractedNumber = parseInt(dayMatch[0]);
        let constCate = `${extractedNumber} Days`;
        return constCate;
      }
    } else if (ageOfPatient == "") {
      return "";
    } else {
      return ageOfPatient + "Years";
    }
  };
  return (
    <div>
      <div className="!cust-t-g1 flex w-full py-1 px-3 text-sm text-blue-600 rounded-lg mb-2 bg-blue-gray-100">
        <span className="capitalize">
          {"Bill Number : "} {billNoInfo?.billNumber} | {"Order Date : "}{" "}
          {billNoInfo?.generatedDate
            ? moment(billNoInfo?.generatedDate).format("YYYY-MM-DD HH:mm")
            : ""}{" "}
          | {"Ordered By : "} {billNoInfo?.generatedBy}
        </span>
      </div>
      <div className="!cust-t-g1 flex w-full py-1 px-3 text-sm text-blue-600 rounded-lg mb-2 bg-blue-gray-100">
        <span className="">
          {patientData?.patientName} | {patientData?.MRN} |{" "}
          {patientData?.ageOfPatient ? getAge(patientData?.ageOfPatient) : ""} |{" "}
          {patientData?.genderDesc} | {patientData?.healthId} |{" "}
          {patientData?.abhaAddress ? patientData?.abhaAddress : ""}
        </span>
      </div>
    </div>
  );
};

export default PatientHeaderBillDetails;
