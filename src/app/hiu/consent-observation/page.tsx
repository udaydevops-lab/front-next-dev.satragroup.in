"use client";

import React, { useEffect } from "react";
import { observationApi } from "./observationapi";
import moment from "moment";
import services from "@/app/utilities/services";
import { decryptData } from "@/app/utilities/api-urls";

const ObservationList = () => {
  useEffect(() => {
    // services
    //   .get(decryptData + consentId)
    //   .then((data) => {
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);
  return (
    <>
      <div className="mainSection position-relative">
        <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
          <h1>Op Consultation</h1>
        </div>
        <div className="mainbgWrapper border-stroke p-5">
          <ul>
            <li className="w-full flex bg-blue-500 text-white px-3 py-2 items-center">
              <div className="w-[20%]">Date</div>
              <div className="w-[80%] flex items-center">
                <div className="w-[30%]">Observation</div>
                <div className="w-[60%] px-2">Value</div>
                <div className="w-[10%]">Status and Interpretation</div>
              </div>
            </li>
            <p>{observationApi.practioner.practionerName}</p>
            <p>{observationApi.patient.gender}</p>
            <p>{observationApi.patient.phone}</p>
            <p>{observationApi.patient.name}</p>
            <p>{observationApi.patient.value}</p>
            <p>{observationApi.patient.birthDate}</p>
            <p>{observationApi.patient.home}</p>
            <p
              dangerouslySetInnerHTML={{
                __html: observationApi["DocumentReference/1"].text.div,
              }}
            ></p>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ObservationList;
