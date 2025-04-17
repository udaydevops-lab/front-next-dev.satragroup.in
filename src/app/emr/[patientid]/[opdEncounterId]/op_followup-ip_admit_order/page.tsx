"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { Input, Radio } from "@material-tailwind/react";
import Textarea from "@/app/_common/text-area";
import DateInput from "@/app/_common/date-input";

import PatientHeader from "../_components/patient-header";
import ActionButton from "@/app/_common/button";
import Select from "react-tailwindcss-select";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  getOpfollow,
  saveOpfollow,
  snowmedData,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { toast } from "react-toastify";
import { getLocalItem } from "@/app/utilities/local";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";
function OpFollowupIpAdmitOrder(props: any) {
  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [carePlanType, setCarePlanType] = useState<any>({
    value: 1,
    label: "Care Plan Type ",
  });
  const [carePlanTypeData, setCarePlanTypeData] = useState<any>([
    { value: 1, label: "Outpatient Care Plan" },
  ]);
  const [comments, setComments] = useState("");
  const [key, setKey] = useState("");
  const [id, setId] = useState("");
  const [opFollowUpDate, setOpFollowUpDate] = useState<any>(moment());
  const storedLoginResponse = getLocalItem("loginResponse");
  let empName;
  try {
    empName = storedLoginResponse
      ? JSON.parse(storedLoginResponse).employeename
      : "";
  } catch (error) {
    console.error("Error parsing JSON:", error);
    empName = ""; // Set a default value or handle the error accordingly
  }
  const doctor = empName;
  const handleOpFollowup = () => {};
  const handelopFollowUpDate = (e: any) => {
    setOpFollowUpDate(e);
  };
  //save function
  const handleSaveOpFolloup = () => {
    const postObj = {
      patientId: patientid,
      opdEncounterId: opdEncounterId,
      opFollowUpAdvice: comments,
      opFollowUpDate: moment(opFollowUpDate).format("YYYY-MM-DD"),
      snomedCode: "736271009",
      snomedDesc: "Outpatient care plan",
      conceptId: "736271009",
      recordedBy: doctor,
      id: id ? id : null,
      snomedData: {
        hierarchy: "procedure",
        isPreferredTerm: "0",
        conceptState: "1",
        conceptFsn: "Outpatient care plan",
        definitionStatus: "900000000000074008",
        conceptId: "736271009",
        languageCode: "en",
        typeId: "900000000000013009",
        term: "Outpatient care plan",
        caseSignificanceId: "CASE_SENSITIVE",
        id: "7194029021",
        effectiveTime: "20180131",
        activeStatus: 1,
        moduleId: "900000000000207008",
      },
    };
    services
      .create(saveOpfollow, postObj)
      .then((response) => {
        setOpFollowUpDate(null);
        setComments(" ");
        setKey(key + key);
        toast.success("success");
        getOpfollowData();
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const backToEMR = () => {
    router.push(`/emr/${patientid}/${opdEncounterId}/emrCaseSheet`);
  };
  const getCareType = async () => {
    try {
      const response = await services.get(snowmedData + "736271009");
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };
  const getOpfollowData = async () => {
    const url = `${getOpfollow}${patientid}/${opdEncounterId}`;
    try {
      const response = await services.get(url);
      const result = response.data;
      setOpFollowUpDate(moment(result[0].dateFollowUp));
      setComments(result[0].opFollowUpAdvice);
      setId(result[0].id);
    } catch (error) {
      console.error("Error fetching Opfollow Data:", error);
    }
  };
  useEffect(() => {
    getCareType();
    getOpfollowData();
  }, []);
  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <>
      <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
        <div className="block" key={key}>
          <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
            <h1 className="w-full">
              <span className="w-3/4 float-left"></span>Op Followup{" "}
              <span
                className=" w-1/4 float-right text-right cursor-pointer text-blue-600	"
                onClick={backToEMR}
              >
                Back
              </span>
            </h1>
          </div>
          <PatientHeader />
          <div className="w-full md:px-3 my-2 rounded-curve bg-white p-2 px-4">
            {/* Op Followup start  */}

            <div className="w-full md:flex flex-wrap mb-4">
              <div className="md:w-1/6 pe-3 my-2 ">
                <Radio
                  crossOrigin={undefined}
                  value="OpFollowup"
                  name="opFollowup"
                  label="Op Followup"
                  onChange={handleOpFollowup}
                  defaultChecked
                />
              </div>
              <div className="md:w-1/6 px-3 my-2">
                <DateInput
                  label="Op Follow Up Date"
                  value={opFollowUpDate}
                  onChange={handelopFollowUpDate}
                />
              </div>
              <div className="md:w-4/6 ps-6 my-2">
                <div className="my-select relative">
                  <ReactSelectBox
                    value={carePlanType}
                    options={carePlanTypeData}
                    isSearchable={true}
                    isMultiple={false}
                    label="Care Plan Type"
                    onChange={(e: any) => {
                      setCarePlanType(e);
                    }}
                  />

                </div>
              </div>
              <div className="w-full">
                <Textarea
                  label="Op Followup Advice"
                  onChange={(e: any) => {
                    setComments(sanitizeInput(e.target.value));
                  }}
                  value={comments}
                />
              </div>
            </div>
            {/* Op Followup end  */}
            {/* Admission order start  */}
            <div className="w-full pt-4 pb-4 text-right flex justify-end gap-6">
              {props?.screenData?.Save === 1 &&
                <ActionButton
                  buttonText="SAVE"
                  handleSubmit={handleSaveOpFolloup}
                  width="w-[120px] py-3"
                  disabled={!comments ? true : false}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export default roleInfoScreenData(OpFollowupIpAdmitOrder, "OFU")