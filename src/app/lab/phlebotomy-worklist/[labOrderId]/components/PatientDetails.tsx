import moment from "moment";
import React, { Dispatch, SetStateAction } from "react";
interface PatientDetailsprops {
  patDetails: any;
  orderDetails: any;
}
const PatientDetails: React.FC<PatientDetailsprops> = ({
  patDetails,
  orderDetails,
}) => {
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
    <>
      {/* Patient Detsils */}
      <div className="!cust-t-g1 flex w-full py-1 px-3 text-sm text-blue-600 rounded-lg mb-2 bg-blue-gray-100">
        {patDetails.fullName || " "} | {patDetails.mrn || " "} |{" "}
        {patDetails.genderDesc || " "} |{" "}
        {patDetails.ageOfPatient ? <>{getAge(patDetails.ageOfPatient)}</> : " "}{" "}
        | {patDetails.healthId || " "} |{" "}
        {patDetails.abhaAddress ? patDetails.abhaAddress + "@sbx" : " "}
      </div>
      {/* Patient Detsils */}
      <div className="!cust-t-g1 flex w-full py-1 px-3 text-sm text-blue-600 rounded-lg mb-2 bg-blue-gray-100">
        Lab Order ID: {orderDetails.labOrderId || " "} | Oder Date:{" "}
        {orderDetails.generatedDate
          ? moment(orderDetails.generatedDate).format("YYYY-MM-DD")
          : " "}{" "}
        | OPBIll: {orderDetails.billNumber || " "} | Ordered by Dr:{" "}
        {orderDetails.doctor || " "}
      </div>
    </>
  );
};

export default PatientDetails;
