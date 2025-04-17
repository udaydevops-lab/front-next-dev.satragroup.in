"use client";
import {
  getAdditionalVaccinationList,
  getImmunizationRecordDataById,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ImmunizationRecordList = () => {
  const { patientid } = useParams();

  const [imnzRecord, setImnzRecord] = useState<any>([]);
  const [addimnzRecord, setAddImnzRecord] = useState<any>([]);

  const getImmunizationSaveRecord = () => {
    services
      .get(getImmunizationRecordDataById + patientid)
      .then((res) => {
        setImnzRecord(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getAdditionalVaccinationSaveRecord = () => {
    services
      .get(getAdditionalVaccinationList + patientid)
      .then((res) => {
        setAddImnzRecord(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getImmunizationSaveRecord();
    getAdditionalVaccinationSaveRecord();
  }, []);

  return (
    <>
      <div className="cust-card-body flex flex-col p-2 text-xs">
        <div className="flex items-center w-full my-2 -ml-1">
          <div className="w-1/12 z-10">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>
          <div className="w-11/12">
            <p className="text-sm">Immunization Record</p>
            {imnzRecord && imnzRecord.length > 0 ? (
              <>
                {imnzRecord
                  .map((list: any) => (
                    <>
                      <p className="text-xs text-gray-600">
                        {list.vaccineName} || {list.administeredByDoctor} ||{" "}
                        {moment(list.administeredDate).format("YYYY-MM-DD")}
                      </p>
                    </>
                  ))
                  .reverse()
                  .splice(0, 1)}
              </>
            ) : (
              <>
                <p>No Record For Now</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center w-full my-2 -ml-1">
          <div className="w-1/12 z-10">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>
          <div className="w-11/12">
            <p className="text-sm">Additional Vaccination</p>
            {addimnzRecord && addimnzRecord.length > 0 ? (
              <>
                {addimnzRecord
                  .map((list: any) => (
                    <>
                      <p className="text-xs text-gray-500">
                        {list.vaccineName} || {list.administeredByDoctor} ||{" "}
                        {moment(list.administeredDate).format("YYYY-MM-DD")}
                      </p>
                    </>
                  ))
                  .reverse()
                  .splice(0, 1)}
              </>
            ) : (
              <>
                <p>No Record For Now</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImmunizationRecordList;
