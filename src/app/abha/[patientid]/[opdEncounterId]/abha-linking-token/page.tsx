"use client";
import React, { useState, useEffect } from "react";
import FormPropsTextFields from "../../../../_common/input";
import IconButton from "../../../../_common/icon-button";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import OtpField from "../../../../_common/otp-field";
import ActionButton from "../../../../_common/button";
import { useForm } from "react-hook-form";
import ControllerSelect from "@/app/_common/select";
import services from "@/app/utilities/services";
import Input from "../../../../_common/input";
import moment from "moment";

import {
  getPatientDetailsBasedOnId,
  linkingToken,
  submitOTP,
  getConfigData,
  getTokenStatus,
  getContextNumber,
  getAddContextStatus,
  savePatientSearch,
  getEncDetailsByEncId,
  getPatientDetailsById,
  getCareContextOTPStatus,
} from "@/app/utilities/api-urls";
import Loader from "@/app/_common/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Radio } from "@material-tailwind/react";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import Select from "react-tailwindcss-select";
import GenerateSearchPatient from "../../../../_common/generate-search-patient";
import SearchUpdatePatient from "../../../../patient/search-update-patient/page";
import { useParams } from "next/navigation";
import { ReactSelectBox } from "@/app/_commonfeatures";

export default function AbhaLinkingToken() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  interface GenderDataItem {
    code: string;
    desc: string;
  }

  const [genderData, setGenderData] = useState<GenderDataItem[]>([]);
  const [encounterData, setEncounterData] = useState<any>({
    departmentDesc: "",
    doctor: "",
  });
  const [key1, setKey1] = useState(0);
  const [submitButtonStatus, setSubmitButtonStatus] = useState(false);

  const [careConRefNum, setCareConRefNum] = useState("");
  const [authMethod, setAuthMethod] = useState("DEMOGRAPHICS");
  var rollResp = "";

  var loginResponse = getLocalItem("loginResponse");

  if (loginResponse) {
    try {
      const parsedResponse = JSON.parse(loginResponse);
      if (parsedResponse && parsedResponse.rollDesc) {
        rollResp = parsedResponse.rollDesc.toLowerCase();
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }
  useEffect(() => {
    services
      .get(getConfigData + "gender/0")
      .then((response) => {
        setGenderData(response.data.configData);
      })
      .catch((error) => {
        console.log(error.msg);
      });
  }, []);
  const authTypes = [
    {
      id: "link",
      value: "Link",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [encounterDate, setEncounterDate] = useState("");
  const [otpFromChild, setOtpFromChild] = useState("");
  const [OTPfield, setOpenOTPfield] = useState(false);
  const [encounterList, setEncounterList] = useState<any>([]);
  const [encounterValue, setEncounterValue] = useState<any>("");
  const { patientid, opdEncounterId } = useParams();
  const [key, setKey] = useState(0);
  const [key2, setKey2] = useState(200);
  const [gotToken, setGotToken] = useState(false);
  const [isSendOtpDisabled,setIsSendOtpDisabled] = useState(false)
  const [patData, setPatData] = useState({
    patientId: "",
    healthId: "",
    abhaAddress: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    primaryContactNum: "",
    ageOfPatient: "",
    mrn: "",
  });
  const getContextId = (patId: any) => {
    services.get(getContextNumber + "patientId=" + patId).then((response) => {
      response.data.map((item: any, index: number) => {
        response.data[index].label = item.opdEncounterNo.toString();
        response.data[index].value = item.opdEncounterId;
      });
      setEncounterList(response.data);
      handleEncChange(
        response.data.filter((item: any) => item.value == opdEncounterId)[0]
      );
    });
  };
  const getContextRefNumber = (patientId: any, encId: any) => {
    services
      .get(getContextNumber + `opdEncounterId=${encId}&patientId=${patientId}`)
      .then((response) => {
        setCareConRefNum(response.data[0].careContextReference);
      });
  };
  const handlePatChange = (e: any) => {
    setEncounterData({
      departmentDesc: "",
      doctor: "",
    });
    setEncounterValue("");
    setEncounterDate("");
    if (e) {
      const text = e.ageOfPatient;
      const numberRegex = /\d+ Years/;
      const matches = text?.match(numberRegex);
      let extractedNumber: any;
      if (matches && matches.length > 0) {
        extractedNumber = parseInt(matches[0]);
        let constCate = `${extractedNumber} Years`;
        e.ageOfPatient = constCate;
      }
    }
    if (e && !e.abhaAddress) {
      e.abhaAddress = "";
    }
    e
      ? setPatData(e)
      : setPatData({
        patientId: "",
        fullName: "",
        gender: "",
        dateOfBirth: "",
        abhaAddress: "",
        healthId: "",
        primaryContactNum: "",
        ageOfPatient: "",
        mrn: "",
      });
    if (e && !e.abhaAddress) {
      toast.warning("ABHA Address Doesn't Exist Please Update");
    } else if (e && e.abhaAddress.length == 0) {
      toast.warning("ABHA Number Doesn't Exist Please Update");
    }

    if (e) getContextId(e.patientId);
    else {
      setEncounterList([]);
      setEncounterValue("");
      setEncounterDate("");
      setEncounterData({
        departmentDesc: "",
        doctor: "",
      });
    }
  };
  const getEncDetails = (encId: any) => {
    setLoading(true);
    services
      .get(getEncDetailsByEncId + encId)
      .then((response) => {
        setLoading(false);
        setEncounterData(response.data.opdEncounerPractionerList[0]);
        console.log(
          "first",
          response.data.opdEncouterDetails.opdEncouterDetails.generatedDate
        );
        setEncounterDate(
          moment(
            response.data.opdEncouterDetails.opdEncouterDetails.generatedDate
          ).format("DD-MM-YYYY")
        );
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Technical Error");
      });
  };
  const handleEncChange = (e: any) => {
    setEncounterValue(e);
    getEncDetails(e.opdEncounterId);
    getContextRefNumber(e.patientId, e.opdEncounterId);
  };
  const authorize = () => {
    if (encounterValue) {
      if (patData?.abhaAddress) {
        let postObj: { customHealthId: string; initMode: string } = {
          customHealthId: patData?.abhaAddress, //"bhanu123456"(for tcl testing),
          initMode: authMethod,
        };
        setLoading(true);
        services
          .create(linkingToken, postObj)
          .then((response) => {
            setLoading(false);
            if (typeof localStorage !== "undefined") {
              setLocalItem("requestId", response.data.requestId);
            }
            if (authMethod == "AADHAAR_OTP" || authMethod == "MOBILE_OTP") {
              toast.success("OTP sent successfully");
              setOtpSeconds(59);
              setIsSendOtpDisabled(true)
              setOtpResend(true);
              setOpenOTPfield(true);
            }
            if (authMethod == "DEMOGRAPHICS") {
              // toast.success("Demographics Authorization Initiated");
              setLoading(true);
              let postObj = {};
              setTimeout(() => {
                postObj = {
                  txnId: getLocalItem("requestId"),
                  // authentCode: window.btoa(otpFromChild),
                  contactNumber: patData.primaryContactNum, //"9948543032" (for tcl testing),
                  dob: moment(patData.dateOfBirth!).format("YYYY-MM-DD"), //"1987-10-06" (for tcl testing),
                  gender:
                    patData?.gender == "G1001"
                      ? "M"
                      : patData?.gender == "G1002"
                        ? "F"
                        : "", //"M" (for tcl testing),
                  fullName: patData.fullName, //"Bhanuchander" (for tcl testing),
                  demographicType: "MOBILE",
                };
              }, 1000);

              setTimeout(() => {
                verifyOTP(postObj);
              }, 1100);
            }
            setSubmitButtonStatus(false);
          })
          .catch((err) => {
            setLoading(false);
            toast.error("Technical Error");
          });
      } else {
        toast.error("Abha address is required Please Update");
      }
    } else {
      toast.error("Please Select Encounter");
    }
  };

  const clickreset = () => {
    setKey2((k) => k + 1);
    setOtpFromChild("");
  };

  var obj: { [k: string]: any } = {};
  if (typeof window !== "undefined") {
    obj.txnId = getLocalItem("requestId");
  }
  const checkOtpStatus = (reqId: string) => {
    setLoading(true)
    services
      .get(getCareContextOTPStatus + reqId)
      .then((response) => {
        if (response.data.length==1) {
          setLoading(false);
          toast.error(response.data[0].errorMsg);
        } else {
          setLoading(false);
          toast.success("OTP Verified successfully");
          setOtpResend(false);
          setGotToken(true);
          // setLocalItem("accessToken", response.data.accessToken);
          // setLocalItem("requestId", response.data.requestId);
        }
      })
      .catch((err) => {
        toast.error("Technical Error");
        setLoading(false);
      });
  };
  const verifyOTP = (postObj: any) => {
    setLoading(true);
    services
      .create(submitOTP, postObj)
      .then((response) => {
        setLocalItem("requestId", response.data.requestId);
        setTimeout(() => {
          checkOtpStatus(response.data.requestId);
        }, 2000);
      })
      .catch((error) => {
        console.log(error.msg);
        setLoading(false);
      });
  };
  const onSubmitOTP = (e: any) => {
    if (OTPfield && otpFromChild.length === 6) {
      obj.authentCode = window.btoa(otpFromChild);
      let postObj = {
        txnId: getLocalItem("requestId"),
        authentCode: window.btoa(otpFromChild),
        contactNumber: patData.primaryContactNum, //"9948543032" (for tcl testing),
        dob: moment(patData.dateOfBirth).format("YYYY-MM-DD"), //"1987-10-06" (for tcl testing)
        gender:
          patData?.gender == "G1001"
            ? "M"
            : patData?.gender == "G1002"
            ? "F"
            : "", //"M" (for tcl testing),
        fullName: patData.fullName, //"Bhanuchander" (for tcl testing),
        demographicType: "MOBILE",
      };
      verifyOTP(postObj);
    } else if (OTPfield && otpFromChild.length != 6) {
      toast.error("Please enter 6 digit OTP");
    } else if (authMethod == "DEMOGRAPHICS") {
      authorize();
    }
  };
  const clearFields = () => {
    setKey((k) => k + 1);
    setIsSendOtpDisabled(false); 
    setPatData({
      patientId: "",
      fullName: "",
      gender: "",
      dateOfBirth: "",
      primaryContactNum: "",
      healthId: "",
      abhaAddress: "",
      ageOfPatient: "",
      mrn: "",
    });
    setEncounterList([]);
    setEncounterValue("");
    setEncounterDate("");
    setEncounterData({
      departmentDesc: "",
      doctor: "",
    });
    setOpenOTPfield(false);
    setValue("healthId", "");
    setCareConRefNum("");
    setOpen(false);
    setAuthMethod("DEMOGRAPHICS");
    setGotToken(false);
    setOtpResend(false);
    
  };

  const handlePatientD = (e: any) => {
    services
      .get(getPatientDetailsBasedOnId + e)
      .then((response) => {
        const obj = { ...response.data };
        let data = genderData.filter(
          (val) => val.code === response.data.gender
        )[0].desc;
        obj.gender = data;
        const text = response.data.ageOfPatient;
        const numberRegex = /\d+ Years/;
        const matches = text?.match(numberRegex);
        let extractedNumber: any;
        if (matches && matches.length > 0) {
          extractedNumber = parseInt(matches[0]);
          let constCate = `${extractedNumber} Years`;
        }
        setKey1((k) => k + 1);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };
  const checkStatus = (requestId: any) => {
    services
      .get(getAddContextStatus + requestId)
      .then((response) => {
        setLoading(false);
        if (response.data.addContextStatus && response.data.error) {
          toast.error(
            response.data.addContextStatus + " , " + response.data.message
          );
        } else if (response.data.addContextStatus) {
          toast.success(response.data.addContextStatus);
          clearFields();
        }
      })
      .catch((error) => {
        toast.error("Technical Error");
        setLoading(false);
      });
  };
  const submitdata = () => {
    let postObj = {
      txnId: getLocalItem("requestId"),
      // accessToken: getLocalItem("accessToken"),
      patientRefNum: patData.mrn, //"202309155",
      patientDisplay: patData.fullName, //"Bhanuchander", //patId
      careContextRefNum: careConRefNum, //"123456", // encounterId
      careConextDisplay:
        "OP" +
        "-" +
        moment().format("DD-MM-YYYY") +
        "-" +
        encounterData.departmentDesc, //"Bhanu",
    };
    setLoading(true);
    services
      .create(getTokenStatus, postObj)
      .then((response) => {
        let data = response.data.requestId;
        setTimeout(() => checkStatus(data), 5000);
      })
      .catch((error) => {
        console.log(error.msg);
        setLoading(false);
        toast.error("Technical Error");
      });
  };

  const initiateLink = () => {
    setOpen(true);
    handlePatientD(encounterData.patientId);
  };

  const handleRadioChange = (e: any) => {
    setAuthMethod(e.target.value);
    setSubmitButtonStatus(true);
    if (e.target.value == "DEMOGRAPHICS") {
      setOpenOTPfield(false);
      setGotToken(false);
      setSubmitButtonStatus(false);
      setIsSendOtpDisabled(false); 
      setOtpResend(false);
    } else if (e.target.value == "AADHAAR_OTP") {
      setOpenOTPfield(true);
      setGotToken(false);
      setIsSendOtpDisabled(false); 
      setOtpResend(false);
    } else if (e.target.value == "MOBILE_OTP") {
      setOpenOTPfield(true);
      setIsSendOtpDisabled(false); 
      setGotToken(false);
      setOtpResend(false);
    }
  };
  const [otpResend, setOtpResend] = useState(true);
  const [otpSeconds, setOtpSeconds] = useState(0);
  const otpStatus = () => {};
  const [searchpopup, setSearchPopup] = useState(false);
  const patSearchById = (data: any) => {
    services.get(getPatientDetailsById + data).then((response) => {
      let obj: any = { ...response.data.patData };
      obj.mrn = response.data.mrn;
      obj.abhaAddress = response.data.abhaAddress;
      obj.patientId = response.data.patientId;
      obj.value = response.data.patData.patientId;
      obj.label = response.data.patData.firstName + " - " + response.data.mrn;
      handlePatChange(obj);
    });
  };

  useEffect(() => {
    if (patientid !== "0") {
      patSearchById(patientid);
    }
  }, []);
  const generateSearchP = () => {
    setSearchPopup(true);
  };
  return (
    <div key={key}>
      {loading ? <Loader /> : ""}
      <div className="font-bold flex justify-between items-center px-4 md:pt-3 pb-3 mx-auto w-full ">
        <h1>ABHA Linking</h1>
        <div className="en-autocomplteGserch flex items-center justify-end ml-4 pl-4">
          <ActionButton
            buttonText=" Advanced Search"
            handleSubmit={generateSearchP}
            width="fit-content"
          />
        </div>
        <GenerateSearchPatient
          open={searchpopup}
          setOpen={setSearchPopup}
          size={"xl"}
          content={
            <SearchUpdatePatient
              screen={"linkingToken"}
              patSearchById={patSearchById}
              popupclose={setSearchPopup}
            />
          }
        />
      </div>
      <div className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <div className="mb-2  grid gap-y-2 gap-x-1 md:grid-cols-2 xl:grid-cols-2">
          <div className="relative flex flex-col p-2 ">
            <Input
              type="text"
              label="Patient MRN"
              name="mrn"
              watch={watch}
              disabled={false}
              value={patData.mrn ? patData.mrn : ""}
            />
          </div>
          <div className=" flex gap-4 p-2 ">
            <div className="w-1/2">
              <ReactSelectBox
                options={encounterList}
                value={encounterValue}
                label="Encounter"
                onChange={handleEncChange}
                isSearchable={true}
              />
            </div>
            <div className="w-1/2">
              <Input
                type="text"
                label="Care Context Reference"
                name="ccr"
                watch={watch}
                disabled={false}
                value={careConRefNum ? careConRefNum : ""}
              />
            </div>
          </div>
        </div>
        <div className="mb-2  grid gap-y-2 gap-x-1 md:grid-cols-2 xl:grid-cols-2">
          <div className="relative flex flex-col p-2 ">
            <Input
              type="text"
              label="Patient Name"
              name="patientName"
              watch={watch}
              disabled={false}
              value={patData.fullName ? patData.fullName : ""}
            />
          </div>
          <div className="relative flex flex-col p-2 ">
            <Input
              type="text"
              label="Encounter Date"
              name="patientId"
              watch={watch}
              disabled={false}
              value={encounterDate}
            />
          </div>
        </div>
        <div className="mb-2  grid gap-y-2 gap-x-1 md:grid-cols-2 xl:grid-cols-2">
          <div className="relative flex flex-col p-2 ">
            <Input
              type="text"
              label="Date Of Birth"
              name="dateOfBirth"
              watch={watch}
              disabled={false}
              value={
                patData?.dateOfBirth
                  ? moment(patData?.dateOfBirth).format("DD-MM-YYYY")
                  : ""
              }
            />
          </div>
          <div className="relative flex flex-col p-2 ">
            <Input
              type="text"
              label="Encounter Type"
              name="encounterType"
              watch={watch}
              disabled={false}
              value={"OP"}
            />
          </div>
        </div>
        <div className="mb-2  grid gap-y-2 gap-x-1 md:grid-cols-2 xl:grid-cols-2">
          <div className="relative flex flex-col p-2 ">
            <Input
              type="text"
              label="Gender"
              name="gender"
              watch={watch}
              disabled={false}
              value={
                patData?.gender == "G1001"
                  ? "Male"
                  : patData?.gender == "G1002"
                  ? "Female"
                  : ""
              }
            />
          </div>
          <div className="relative flex flex-col p-2 ">
            <Input
              type="text"
              label="Doctor Name"
              name="patientId"
              watch={watch}
              disabled={false}
              // value={"Ramesh"} for tcl testing
              value={encounterData?.doctor}
              // handleChange={(e: any) => handleData(e, "policyNo")}
            />
          </div>
        </div>
        <div className="mb-2  grid gap-y-2 gap-x-1 md:grid-cols-2 xl:grid-cols-2">
          <div className="relative flex flex-col p-2 ">
            <Input
              type="text"
              label="ABHA Number"
              name="healthId"
              watch={watch}
              required={true}
              disabled={false}
              value={patData?.healthId}
            />
          </div>
          <div className="relative flex flex-col p-2 ">
            <Input
              type="text"
              label="Speciality / Department"
              name="patientId"
              watch={watch}
              disabled={false}
              value={encounterData?.departmentDesc}
            />
          </div>
        </div>
        <div className="mb-2  grid gap-y-2 gap-x-1 md:grid-cols-2 xl:grid-cols-2">
          <div className="relative flex flex-col p-2">
            <Input
              type="text"
              label="ABHA Address"
              name="abhaAdress"
              watch={watch}
              required={true}
              disabled={false}
              value={patData?.abhaAddress}
              inputRef={register("abhaAdress")}
            />
          </div>
          <div className="relative flex flex-col p-2 w-1/4">
            <ActionButton
              buttonText="Initiate Link"
              backgroundColor="white"
              color="blue"
              width="w-[180px] text-white  text-[14px] h-[40px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              border="2px solid black"
              handleSubmit={handleSubmit(initiateLink)}
            />
          </div>
        </div>
        {open ? (
          <div>
            <div className="mb-4 -mx-3 md:flex py-2">
              <div className="md:w-1/4 px-3 my-2">
                <ControllerSelect
                  name="purpose"
                  label="Purpose"
                  width="300px"
                  listItems={authTypes}
                  keyValue={"id"}
                  disabled={true}
                  value={"link"}
                  displayValue="value"
                  control={control}
                />
              </div>

              <div className="md:w-1/2 px-3 my-2">
                <FormPropsTextFields label="MRN" value={patData?.mrn} />
              </div>
            </div>
            <div key={key1} className="mb-4 -mx-3 md:flex py-2">
              <div className="md:w-1/4 px-3">
                <p className=" text-xs font-semibold leading-tight mb-3">
                  Patient Name
                </p>
                <p className="text-xs leading-tight text-slate-400">
                  {patData?.fullName}
                  {/* {/ Bhanuchander /} */}
                </p>
              </div>
              <div className="md:w-1/4 px-3">
                <p className="text-xs font-semibold leading-tight  mb-3">
                  {" "}
                  Gender/Age
                </p>
                <p className="text-xs leading-tight text-slate-400">
                  {patData?.gender == "G1001"
                    ? "Male"
                    : patData?.gender == "G1002"
                    ? "Female"
                    : ""}
                  /{patData.ageOfPatient}
                  {/* {/ 35 /} */}
                </p>
              </div>
              <div className="md:w-1/4 px-3">
                <p className="text-xs font-semibold leading-tight mb-3">
                  Mobile Number
                </p>
                <p className="text-xs leading-tight text-slate-400">
                  {patData?.primaryContactNum}
                </p>
              </div>
            </div>
            <hr className="mb-6 border-t" />
            <div className="flex w-2/3">
              <li className="my-1 flex w-1/4 items-center">
                <Radio
                  crossOrigin={undefined}
                  {...register("auth")}
                  label="Demographics"
                  value={"DEMOGRAPHICS"}
                  onChange={handleRadioChange}
                  defaultChecked={true}
                />
              </li>
              <li className="my-1 flex w-1/4 items-center">
                <Radio
                  crossOrigin={undefined}
                  {...register("auth")}
                  name="auth"
                  label="Aadhaar OTP"
                  value={"AADHAAR_OTP"}
                  onChange={handleRadioChange}
                />
              </li>
              <li className="my-1 flex w-1/4 items-center">
                <Radio
                  crossOrigin={undefined}
                  {...register("auth")}
                  name="auth"
                  label="Mobile OTP"
                  value={"MOBILE_OTP"}
                  onChange={handleRadioChange}
                />
              </li>
            </div>
            {OTPfield ? (
              <div key={key2} className="-mx-3 md:flex ">
                <div className="md:w-1/2 px-3 my-2">
                  <div className=" -mx-3 md:flex ">
                    <div className="ms-6">
                      <ActionButton
                        buttonText="Send OTP"
                        backgroundColor="white"
                        color="blue"
                        disabled={isSendOtpDisabled}
                        width="w-[180px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        border="2px solid black"
                        handleSubmit={handleSubmit(authorize)}
                      />
                    </div>
                    <div className="md:w-1/2 px-5">
                      <OtpField
                        onResendOTP={handleSubmit(authorize)}
                        setOtpFromChild={setOtpFromChild}
                        otpStatus={otpStatus}
                        resendotp={otpResend}
                        seconds={otpSeconds}
                        setSeconds={setOtpSeconds}
                        setResendOtp={(flag: any) => setOtpResend(flag)}
                      />
                    </div>
                    <li className="my-1 flex w-auto items-center">
                      <div className="md:w-1/4 px-3 flex ">
                        {/* <span className="mx-4">
                          <IconButton
                            className="cursor-pointer"
                            icon={<DoneIcon titleAccess="Send OTP" color="primary" />}
                            onClick={handleSubmit(authorize)}
                          />
                        </span> */}
                        <span className="mb-6" title="Clear">
                          <IconButton
                            className="cursor-pointer"
                            icon={<CloseIcon color="primary" />}
                            onClick={clickreset}
                          />
                        </span>
                      </div>
                    </li>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mb-4 -mx-3 md:flex ">
              <div className="md:w-1/2 px-3 my-2"></div>
              <div className="md:w-1/2 px-3 my-2"></div>
              <div className="md:w-1/4 px-3">
                {gotToken ? (
                  <div className="flex justify-end gap-4 me-3">
                    <ActionButton
                      buttonText="Submit care context"
                      backgroundColor="white"
                      color="blue"
                      width="w-[400px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                      border="2px solid black"
                      handleSubmit={submitdata}
                    />

                    <ActionButton
                      buttonText="Reset"
                      backgroundColor="white"
                      width="w-[180px] text-white  text-[14px] !bg-[#006AC9] h-[42px] hover:bg-[#006AC9] border-[#006AC9]"
                      border="2px solid black"
                      handleSubmit={clearFields}
                    />
                  </div>
                ) : (
                  <div className="flex justify-end gap-4 me-3">
                    <ActionButton
                      buttonText="Submit"
                      width="w-[180px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                      disabled={submitButtonStatus}
                      backgroundColor="rgb(2,132,199)"
                      handleSubmit={handleSubmit(onSubmitOTP)}
                    />
                    <ActionButton
                      buttonText="Reset"
                      backgroundColor="white"
                      width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[42px] hover:bg-[#006AC9] border-[#006AC9]"
                      border="2px solid black"
                      handleSubmit={clearFields}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
