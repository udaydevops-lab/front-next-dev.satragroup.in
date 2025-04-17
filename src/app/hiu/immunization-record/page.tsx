import React from "react";
import { ImmData } from "./immunizationData";
import { Divider } from "@mui/material";

export default function ImmunizationRecord() {
  return (
    <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="items-center">
        <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">Immunization Record</div>
        <Divider className="mt-5 mb-5" />
        <div className="mt-5">
          <b>Practioner:</b>
          <span className="ml-3">{ImmData.practioner.practionerName}</span>
        </div>
        <Divider className="mt-5 mb-5" />
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 col-span-3">
          <div className="mt-5">
            <b>Patient Name:</b>
            <span className="ml-3">{ImmData.patient.name}</span>
          </div>
          <div className="mt-5">
            <b>Gender:</b>
            <span className="ml-3">{ImmData.patient.gender}</span>
          </div>
          <div className="mt-5">
            <b>Date of Birth:</b>
            <span className="ml-3">{ImmData.patient.birthDate}</span>
          </div>
          <div className="mt-5">
            <b>Phone Number:</b>
            <span className="ml-3">{ImmData.patient.value}</span>
          </div>
        </div>
        <Divider className="mt-5 mb-5" />
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: ImmData["ImmunizationRecommendation/1"].text.div,
            }}
          ></div>
        </div>
        <div className="mt-5">
          <b>Vaccine:</b>
          <span className="ml-3">
            {
              ImmData["ImmunizationRecommendation/1"].recommendation[0]
                .vaccineCode[0].coding[0].display
            }
          </span>
        </div>
        <div className="mt-5">
          <b>Status:</b>
          <span className="ml-3">
            {
              ImmData["ImmunizationRecommendation/1"].recommendation[0]
                .forecastStatus.coding[0].display
            }
          </span>
        </div>
      </div>
    </div>
  );
}
