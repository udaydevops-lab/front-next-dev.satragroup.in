"use client";
import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
// import NewAutocomplete from '../_common/autocomplete'
// import { Select, Option } from "@material-tailwind/react";
// import ControllerSelect from '../_common/select';
import { useForm } from "react-hook-form";
import DateInput from "@/app/_common/date-input";
import CheckboxMui from "@/app/check-box";
import ActionButton from "@/app/_common/button";
import NewAutocomplete from "@/app/_common/autocomplete";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-tailwindcss-select";
import services from "@/app/utilities/services";
import {
  createConsent,
  getPatBytxnId,
  getPatientByAbhaAddress,
} from "@/app/utilities/api-urls";
import Input from "../../_common/input";
import { getLocalItem } from "@/app/utilities/local";
import Loader from "@/app/_common/loader";
import { EyeIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@material-tailwind/react";
import { getContent } from "./_components/utils";
export default function ConsentRequestForm({
  getConsentResult,
  formData,
  type,
}: any) {
  const {
    watch,
    formState: { errors },
  } = useForm();
  const purposeOfReqData: any = [
    {
      value: "CAREMGT",
      label: "Care Management",
    },
  ]; //dummy data
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const [check1, setCheck1] = useState(
    formData?.updatedHiTypes
      ? formData?.updatedHiTypes?.includes("DiagnosticReport")
      : true
  );
  const [check2, setCheck2] = useState(
    formData?.updatedHiTypes
      ? formData?.updatedHiTypes?.includes("DischargeSummary")
      : true
  );
  const [check3, setCheck3] = useState(
    formData?.updatedHiTypes
      ? formData?.updatedHiTypes?.includes("HealthDocumentRecord")
      : true
  );
  const [check4, setCheck4] = useState(
    formData?.updatedHiTypes
      ? formData?.updatedHiTypes?.includes("ImmunizationRecord")
      : true
  );
  const [check5, setCheck5] = useState(
    formData?.updatedHiTypes
      ? formData?.updatedHiTypes?.includes("OPConsultation")
      : true
  );
  const [check6, setCheck6] = useState(
    formData?.updatedHiTypes
      ? formData?.updatedHiTypes?.includes("Prescription")
      : true
  );
  const [check7, setCheck7] = useState(
    formData?.updatedHiTypes
      ? formData?.updatedHiTypes?.includes("WellnessRecord")
      : true
  );
  // const [checkSelectAll, setCheckSelectAll] = useState(
  //   formData?.hiTypes.includes("DiagnosticReport") &&
  //     formData?.hiTypes.includes("DischargeSummary") &&
  //     formData?.hiTypes.includes("WellnessRecord") &&
  //     formData?.hiTypes.includes("HealthDocumentRecord") &&
  //     formData?.hiTypes.includes("ImmunizationRecord") &&
  //     formData?.hiTypes.includes("OPConsultation") &&
  //     formData?.hiTypes.includes("Prescription")
  //   // "DiagnosticReport",
  //   // "DischargeSummary",
  //   // "HealthDocumentRecord",
  //   // "ImmunizationRecord",
  //   // "OPConsultation",
  //   // "Prescription",
  //   // "WellnessRecord"
  //   )
  // );
  const [arr, setArr] = useState<any>([
    "DiagnosticReport",
    "DischargeSummary",
    "HealthDocumentRecord",
    "ImmunizationRecord",
    "OPConsultation",
    "Prescription",
    "WellnessRecord",
  ]);

  const handleCheck1 = () => {
    setCheck1(check1);
    // if (arr.indexOf("DiagnosticReport") > -1) {
    //   return arr.splice(arr.indexOf("DiagnosticReport"), 1);
    // }
    // arr.push("DiagnosticReport");
  };
  const handleCheck2 = () => {
    setCheck2(check2);
    // if (arr.indexOf("DischargeSummary") > -1) {
    //   return arr.splice(arr.indexOf("DischargeSummary"), 1);
    // }
    // arr.push("DischargeSummary");
  };
  const handleCheck3 = () => {
    setCheck3(check3);
    // if (arr.indexOf("HealthDocumentRecord") > -1) {
    //   return arr.splice(arr.indexOf("HealthDocumentRecord"), 1);
    // }
    // arr.push("HealthDocumentRecord");
  };
  const handleCheck4 = () => {
    setCheck4(check4);
    // if (arr.indexOf("ImmunizationRecord") > -1) {
    //   return arr.splice(arr.indexOf("ImmunizationRecord"), 1);
    // }
    // arr.push("ImmunizationRecord");
  };
  const handleCheck5 = () => {
    setCheck5(check5);
    // if (arr.indexOf("OPConsultation") > -1) {
    //   return arr.splice(arr.indexOf("OPConsultation"), 1);
    // }
    // arr.push("OPConsultation");
  };
  const handleCheck6 = () => {
    setCheck6(check6);
    // if (arr.indexOf("Prescription") > -1) {
    //   return arr.splice(arr.indexOf("Prescription"), 1);
    // }
    // arr.push("Prescription");
  };
  const handleCheck7 = () => {
    setCheck7(check7);
    // if (arr.indexOf("WellnessRecord") > -1) {
    //   return arr.splice(arr.indexOf("WellnessRecord"), 1);
    // }
    // arr.push("WellnessRecord");
  };
  const [loading, setLoading] = useState(false);
  const [purposeOfRequest, setPurposeOfRequest] = useState<any>(
    formData?.purpose
  );
  const [healthInfoTo, setHealthInfoTo] = useState<any>(
    moment(formData?.dateRangeTo)
  );
  const [healthInfoFrom, setHealthInfoFrom] = useState<any>(
    moment(formData?.dateRangeFrom)
  );
  const [consentExpiry, setConsentExpiry] = useState<any>(
    moment(formData?.dateErraiseAt)
  );
  const [patIdentifier, setPatIdentifier] = useState<any>(formData?.healthId);
  const handlePurposechange = (e: any) => {
    setPurposeOfRequest(e);
  };
  const onRequestConsent = () => {
    let postObj = {
      purposeOfReq: purposeOfRequest.label,
      healthId: patIdentifier + `@${loginResponse?.abhaSuffix=='abdm'?'abdm':'sbx'}`,
      practionerName: JSON.parse(getLocalItem("loginResponse")!).employeename,
      consentMngrId: null,
      healthInfoType: arr,
      healthInfoFrom: moment(healthInfoFrom).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ),
      healthInfoTo: moment(healthInfoTo).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      dataEraiseAt: moment(consentExpiry).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      structureType: "CAREMGT",
    };
    setLoading(true);
    services
      .create(createConsent, postObj)
      .then((response) => {
        setLoading(false);
        toast.success("Request consent generated successfully!!");
        getConsentResult();
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Technical error, please try again");
        console.log(error.message);
      });
  };
  const handleSelectAll = (flag: boolean) => {
    // setCheckSelectAll(!checkSelectAll);
    setCheck1(flag);
    setCheck2(flag);
    setCheck3(flag);
    setCheck4(flag);
    setCheck5(flag);
    setCheck6(flag);
    setCheck7(flag);
    if (arr.length == 0) {
      setArr([
        "WellnessRecord",
        "Prescription",
        "OPConsultation",
        "ImmunizationRecord",
        "HealthDocumentRecord",
        "DischargeSummary",
        "DiagnosticReport",
      ]);
    } else {
      setArr([]);
    }
  };
  const handleClear = () => {
    setPurposeOfRequest("");
    setHealthInfoTo(moment(null));
    setHealthInfoFrom(moment(null));
    setConsentExpiry(moment(null));
    setPatIdentifier("");
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
    setCheck4(false);
    setCheck5(false);
    setCheck6(false);
    setCheck7(false);
    setArr([]);
  };
  const [consentDetails, setConsentdetails] = useState<any>(<></>);
  const getConsentDetails = () => {
    let obj: any = {};
    obj.abhaAddress = formData?.healthId + `@${loginResponse?.abhaSuffix=='abdm'?'abdm':'sbx'}`;
    obj.consentStatus = formData?.consentStatus;
    obj.dateRangeFrom = moment(formData?.dateRangeFrom).format(
      "YYYY-MM-DD HH:mm"
    );
    obj.dateRangeTo = moment(formData?.dateRangeTo).format("YYYY-MM-DD HH:mm");
    obj.consentExpiryAt = moment(formData?.dateErraiseAt).format(
      "YYYY-MM-DD HH:mm"
    );
    obj.hiTypes = formData?.hiTypes;
    obj.updatedDateRangeFrom = moment(formData?.updatedDateRangeFrom).format(
      "YYYY-MM-DD HH:mm"
    );
    obj.updatedDateRangeTo = moment(formData?.updatedDateRangeTo).format(
      "YYYY-MM-DD HH:mm"
    );
    obj.updatedDateEraseAt = moment(formData?.updatedDateErraiseAt).format(
      "YYYY-MM-DD HH:mm"
    );
    obj.updatedHiTypes = formData?.updatedHiTypes;
    setConsentdetails(getContent(obj));
  };
  const [patientName, setPatientName] = useState("");
  const onSearchPatient = () => {
    let postObj = {
      healthId: patIdentifier + `@${loginResponse?.abhaSuffix=='abdm'?'abdm':'sbx'}`,
    };
    setLoading(true);
    services
      .create(getPatientByAbhaAddress, postObj)
      .then((response) => {
        setTimeout(() => {
          setLoading(true);
          services
            .get(getPatBytxnId + response.data.requestId)
            .then((response) => {
              setLoading(false);
              if(response.data){
                setPatientName(response.data.name)
              }else{
                setPatientName("")
              }
            })
            .catch((error) => {
              setLoading(false);
              toast.error("Technical error, please try again");
              console.log(error.message);
            });
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Technical error, please try again");
        console.log(error.message);
      });
  };
  useEffect(() => {
    if (patIdentifier) {
      onSearchPatient();
    }
    getConsentDetails();
  }, []);
  return (
    <>
      {loading ? <Loader /> : ""}
      <div className=" rounded-lg bg-white  shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        {type !== "save" ? (
          <div className="relative justify-end flex">
            <Tooltip
              content={consentDetails}
              className="w-[500px] mt-10 border z-[99999] absolute -right-[50px] top-[50px] text-black border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
              placement="left-bottom"
            >
              <EyeIcon
                onClick={() => getConsentDetails()}
                className="cursor-pointer"
                width={25}
                height={20}
              />
            </Tooltip>
          </div>
        ) : null}
        <div className="w-full flex gap-4 mt-4">
          <div className="flex gap-6 w-1/2 items-center ">
            <div className="w-1/3">
              ABHA address <span className="text-red-400"> * </span>
            </div>
            <div className="flex relative gap-2 input-width w-3/4 ps-4">
              <div className="md:w-2/3">
                <Input
                  type="text"
                  label="ABHA address"
                  name="patientIdentifier"
                  watch={watch}
                  handleChange={(e: any) => {
                    setPatIdentifier(e.target.value);
                  }}
                  value={patIdentifier}
                />
                <span className="demo bg-white text-blue-gray-700 absolute left-[165px] inset-y-1/4 flex items-center">
                  @{loginResponse?.abhaSuffix=='abdm'?'abdm':'sbx'}
                </span>
              </div>
              <div className="w-full">
                <ActionButton
                  buttonText={"Search"}
                  width="w-full text-white  text-[12px] h-[38px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  handleSubmit={onSearchPatient}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-1/2 items-center">
            <div className="flex items-center justify-start w-1/3">
              Patient name
              {/* <span className="text-red-400"> *</span> */}
            </div>
            <div className="relative w-2/3">
              <Input
                type="text"
                label="Patient name"
                name="patientName"
                watch={watch}
                handleChange={(e: any) => {
                  setPatientName(e.target.value);
                }}
                value={patientName}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex gap-4 mt-6">
          <div className="flex gap-4 w-1/2 items-center">
            <div className="flex items-center justify-start w-1/3">
              Health info from <span className="text-red-400">*</span>
            </div>
            <div className="w-3/4 ps-5">
              <DateInput
                disableFuture={true}
                enableTime={true}
                value={healthInfoFrom}
                onChange={(e: any) => {
                  setHealthInfoFrom(e);
                }}
              />
            </div>
          </div>
          <div className="flex gap-4 w-1/2 items-center">
            <div className="flex items-center justify-start w-1/3 ">
              Health info to <span className="text-red-400">*</span>
            </div>
            <div className="w-2/3">
              <DateInput
                disableFuture={true}
                enableTime={true}
                value={healthInfoTo}
                onChange={(e: any) => {
                  setHealthInfoTo(e);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full items-center mt-6   ">
          <div className="flex items-star justify-start w-1/6 ">
            Consent expiry <span className="text-red-400">*</span>
          </div>
          <div className="w-1/3 p-1 pe-2">
            <DateInput
              enableTime={true}
              value={consentExpiry}
              onChange={(e: any) => {
                setConsentExpiry(e);
              }}
            />
          </div>
          <div className="flex gap-2 w-1/2 items-center">
            <div className="flex items-center justify-start w-1/3">
              Purpose of request <span className="text-red-400"> *</span>
            </div>
            <div className="relative -ps-2 w-2/3">
              <Select
                primaryColor="blue"
                placeholder="Program Code"
                options={purposeOfReqData}
                value={purposeOfRequest}
                onChange={handlePurposechange}
                classNames={{
                  menuButton: ({ isDisabled }: any) =>
                    `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                duration-300 focus:outline-none h-[39px]
                               
                                ${
                                  isDisabled
                                    ? "bg-blue-gray-200"
                                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                }`,
                  menu: "absolute z-10 w-full  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                  listItem: ({ isSelected }: any) =>
                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${
                      isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                    }`,
                }}
              />
              <label
                style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                className={`${
                  purposeOfRequest?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                } 
                                                                    truncate 
                                                                    cursor-default 
                                                                    select-none  
                                                                    absolute transition-all
                                                                   `}
              >
                Program Code
              </label>
            </div>
          </div>
        </div>
        <div className="w-full flex gap-4 mt-6">
          <div className="flex gap-4 w-full items-center">
            <div className="flex items-star justify-start w-1/6">
              Health info type <span className="text-red-400">*</span>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 col-span-3 w-3/4">
              {/* <div className="col-span-3">
                <CheckboxMui
                  label="Select All"
                  checked={checkSelectAll}
                  handleChange={() => handleSelectAll(!checkSelectAll)}
                />
              </div> */}
              <div>
                <CheckboxMui
                  label="Diagnostic Report"
                  checked={check1}
                  handleChange={handleCheck1}
                />
              </div>
              <div>
                <CheckboxMui
                  label="Discharge Summary"
                  checked={check2}
                  handleChange={handleCheck2}
                />
              </div>
              <div>
                <CheckboxMui
                  label="Record Artifact"
                  checked={check3}
                  handleChange={handleCheck3}
                />
              </div>
              <div>
                <CheckboxMui
                  label="Immunization Record"
                  checked={check4}
                  handleChange={handleCheck4}
                />
              </div>
              <div>
                <CheckboxMui
                  label="OP Consultation"
                  checked={check5}
                  handleChange={handleCheck5}
                />
              </div>
              <div>
                <CheckboxMui
                  label="Prescription"
                  checked={check6}
                  handleChange={handleCheck6}
                />
              </div>
              <div>
                <CheckboxMui
                  label="Wellness Record"
                  checked={check7}
                  handleChange={handleCheck7}
                />
              </div>
            </div>
          </div>
        </div>

        {type == "save" ? (
          <>
            <div className="mb-6"></div>
            <div className="flex gap-4 mt-4 justify-end">
              <ActionButton
                buttonText="Request Consent"
                width="w-[150px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={onRequestConsent}
              />
              <ActionButton
                buttonText="Clear"
                width="w-[150px] text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={handleClear}
              />
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
