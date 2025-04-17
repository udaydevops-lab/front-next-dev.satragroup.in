"use client";
import ActionButton from "@/app/_common/button";
import IconButton from "@/app/_common/icon-button";
import OtpField from "@/app/_common/otp-field";
import { Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import services from "@/app/utilities/services";
import {
  enrollmentAadharVerifyOtp,
  enrollmentByAadharOtp,
  enrollMobileVerifyOtp,
  enrollUpdateMobileRequestOtp,
} from "@/app/utilities/api-urls";
import { toast } from "react-toastify";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import NewAbhaSuggestions from "./_components/NewAbhaSuggestions";
import Loader from "@/app/_common/loader";
import CheckboxMui from "@/app/check-box";
import ViewConsent from "./_components/ViewConsent";
import { Divider } from "@mui/material";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function AbhaLinking() {
  const [formData, setFormData] = useState<any>({});
  const [adharOtp, setAdharOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [aadharnumber, setAadharnumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [enableMobVerification, setEnableMobVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [isConsentProvided, setIsConsentProvided] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [key1, setKey1] = useState(0);
  const [key2, setKey2] = useState(70);
  const [isSendAdharOtpDisabled, setIsSendAdharOtpDisabled] = useState(false);
  const [isSendMobileOtpDisabled, setIsSendMobileOtpDisabled] = useState(false);
  const [adharResend, setAdharResend] = useState(true);
  const [adharSeconds, setAdharSeconds] = useState(0);
  const [mobileResend, setMobileResend] = useState(true);
  const [mobileSeconds, setMobileSeconds] = useState(0);
  const [isProcessDisabled, setIsProcessDisabled] = useState(true);
  const [showPassword,setShowPassword] =useState(false)
  const otpStatus = () => { };
  const handleClear = () => {
    setAadharnumber("");
    setMobileNumber("");
    setIsConsentProvided(false);
    setShowConsent(false);
    setMobileOtp("");
    setAdharOtp("");
    setEnableMobVerification(false);
    setFormData({ ...formData, abhaAddress: "" });
    setKey1((k) => k + 1);
    setKey2((k) => k + 2);
    setIsProcessDisabled(true);
    setAdharResend(false);
    setMobileResend(false);
    setIsSendAdharOtpDisabled(false);
    setIsSendMobileOtpDisabled(false);
    setIsSubmitDisabled(false)
  };

  const onAadharSubmit = () => {
    if (aadharnumber !== "") {
      let postObj = {
        loginId: aadharnumber,
      };
      setLoading(true);
      services
        .create(enrollmentByAadharOtp, postObj)
        .then((response) => {
          setLoading(false);
          if (response.data.txnId) {
            if(response.data.message.includes("OTP sent")){
              let number=response.data.message.substring(response.data.message.length-10,response.data.message.length)
              toast.success(`We just sent an OTP on the  Mobile Number ${number}  linked with Aadhaar`)
            }else{
              toast.success(response.data.message);
            }
            setLocalItem("txnId", response.data.txnId);
            setKey1((k) =>k+1)
            setAdharSeconds(59);
            setAdharResend(true);
            setAdharOtp("")
            setIsSendAdharOtpDisabled(true);
          } else {
            toast.error("Something went wrong please try again");
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.statusMessage) {
            if (JSON.parse(err.response.data.statusMessage).loginId) {
              if(JSON.parse(err.response.data.statusMessage).loginId=="Invalid LoginId"){
                toast.error("Invalid Aadhaar number");
              }else{
                toast.error(JSON.parse(err.response.data.statusMessage).loginId);
              }
            } else {
              toast.error(
                JSON.parse(err.response.data.statusMessage).error.message
              );
            }
          } else {
            toast.error("Something went wrong please try again");
          }
        });
    } else {
      toast.error("Please enter Aadhaar number");
    }
  };
  const verifyAadhaarOtp = () => {
    if (adharOtp.length === 6) {
      let postObj = {
        txId: getLocalItem("txnId"),
        mobile: mobileNumber,
        otp: adharOtp,
      };
      setLoading(true);
      services
        .create(enrollmentAadharVerifyOtp, postObj)
        .then((response) => {
          setLoading(false);
          setLocalItem("txnId", response.data.txnId);
          if (response.data.tokens) {
            setLocalItem("abhaLoginToken", response.data.tokens.token)
          }
          if (response.data.ABHAProfile.mobile == mobileNumber) {
            toast.success(
              "Mobile number for communication is same as Aadhaar number. No additional information required, please continue to next step"
            );
            setIsSubmitDisabled(true);
            setIsProcessDisabled(false);
          } else if (response.data.ABHAProfile.mobile != mobileNumber) {
            toast.error(
              "Mobile number for communication is not same as Aadhaar number.Please update your mobile number"
            );
            setIsSubmitDisabled(false);
            setEnableMobVerification(true);
          }
          setAdharSeconds(0);
          setAdharResend(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.statusMessage) {
            toast.error(
              JSON.parse(err.response.data.statusMessage).error.message
            );
          } else {
            toast.error("Something went wrong please try again");
          }
        });
    } else {
      toast.error("Please enter 6 digit otp");
    }
  };
  const onSendMobileOtp = () => {
    let postObj = {
      txId: getLocalItem("txnId"),
      mobile: mobileNumber,
    };
    setLoading(true);
    services
      .create(enrollUpdateMobileRequestOtp, postObj)
      .then((response) => {
        setLoading(false);
        if (response.data.txnId) {
          setKey2((k)=>k+2)
          setIsSendMobileOtpDisabled(true);
          setMobileSeconds(59);
          setMobileResend(true);
          setMobileOtp("")
          toast.success(response.data.message);
          setLocalItem("txnId", response.data.txnId);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.statusMessage) {
          toast.error(
            JSON.parse(err.response.data.statusMessage).error.message
          );
        } else {
          toast.error("Something went wrong please try again");
        }
      });
  };
  const verifyMobileOTP = () => {
    let postObj = {
      otp: mobileOtp,
      txId: getLocalItem("txnId"),
    };
    setLoading(true);
    services
      .create(enrollMobileVerifyOtp, postObj)
      .then((response) => {
        setLoading(false);
        if (response.data.authResult == "Failed") {
          toast.error(response.data.message);
        } else if (response.data.txnId) {
          toast.success(response.data.message);
          setLocalItem("txnId", response.data.txnId);
          setIsSubmitDisabled(true);
          setIsProcessDisabled(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.statusMessage) {
          toast.error(
            JSON.parse(err.response.data.statusMessage).error.message
          );
        } else {
          toast.error("Something went wrong please try again");
        }
      });
  };
  return (
    <div>
      {loading ? <Loader /> : ""}
      <div className="w-full mx-auto max-w-7xl pb-4 md:pb-6 2xl:pb-6">
        <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
          <h1>Create New ABHA</h1>
        </div>
        <div className=" bg-white rounded-curve mb-4 rounded-curve mx-auto w-full border border-stroke p-6 pb-8">
          <div className="flex gap-6">
            <div className="flex w-2/5 gap-4">
              <div className="w-full relative">
                <Input
                  color="blue"
                  type={showPassword ? "text" : "password"}
                  crossOrigin={undefined}
                  label="Aadhaar Number"
                  required
                  onKeyPress={(e: any) => {
                    if (isNaN(e.key)) {
                      e.preventDefault(); // Prevents text input
                    }
                    if (e.key === "Backspace" || e.key === "Delete") return;
                    if (
                      e.target.value.length > 11 ||
                      e.key == "e" ||
                      e.key == "E"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  maxLength={12}
                  value={aadharnumber}
                  onChange={(e: any) => {
                    setAadharnumber(e.target.value)
                  }}
                />
                 <div className=" cursor-pointer absolute right-2 top-[12px]"
                                                onClick={() => setShowPassword(!showPassword)}
                                                >
                                                {showPassword ? (
                                                    <EyeIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                ) : (
                                                    <EyeSlashIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                )}
                                                </div>
                                            
              </div>
              <div>
                <ActionButton
                  width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                  buttonText={"Send OTP"}
                  handleSubmit={onAadharSubmit}
                  disabled={
                    aadharnumber.length !== 12 || isSendAdharOtpDisabled
                  }
                />
              </div>
            </div>
            <div className=" flex gap-4" key={key1}>
              <OtpField
                id="aadhaar"
                onResendOTP={() => onAadharSubmit()}
                setOtpFromChild={setAdharOtp}
                otpStatus={otpStatus}
                resendotp={adharResend}
                seconds={adharSeconds}
                setSeconds={setAdharSeconds}
                setResendOtp={(flag: any) => setAdharResend(flag)}
                key={2}
              />
              <div>
                <CheckboxMui
                  label="Consent Provided"
                  checked={isConsentProvided}
                  handleChange={() => setIsConsentProvided(!isConsentProvided)}
                />
              </div>
              <div
                onClick={() => setShowConsent(true)}
                className="mt-2 font-bold underline cursor-pointer"
              >
                <h1>View consent</h1>
              </div>
            </div>
          </div>
          <div className="flex mt-6 gap-6">
            <div className="flex w-2/5 gap-4">
              <div
                className={`${!enableMobVerification ? `w-[295px]` : "w-full"}`}
              >
                <Input
                  color="blue"
                  type="number"
                  crossOrigin={undefined}
                  label="Mobile Number"
                  required
                  onKeyPress={(e: any) => {
                    if (e.key === "Backspace" || e.key === "Delete") return;
                    if (
                      e.target.value.length > 9 ||
                      e.key == "e" ||
                      e.key == "E"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  value={mobileNumber}
                  onChange={(e: any) => setMobileNumber(e.target.value)}
                />
              </div>
              {enableMobVerification ? (
                <div>
                  <ActionButton
                    width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                    buttonText={"Send OTP"}
                    handleSubmit={onSendMobileOtp}
                    disabled={
                      mobileNumber.length !== 10 || isSendMobileOtpDisabled
                    }
                  />
                </div>
              ) : null}
            </div>
            {enableMobVerification ? (
              <div className=" flex" key={key2}>
                <OtpField
                  id="mobile"
                  onResendOTP={() => onSendMobileOtp()}
                  setOtpFromChild={setMobileOtp}
                  otpStatus={otpStatus}
                  resendotp={mobileResend}
                  seconds={mobileSeconds}
                  setSeconds={setMobileSeconds}
                  setResendOtp={(flag: any) => setMobileResend(flag)}
                  key={3}
                />
              </div>
            ) : null}
          </div>
          {!enableMobVerification ? (
            <div className="mt-4 flex justify-end gap-4">
              <ActionButton
                buttonText={"Next"}
                width="w-[150px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={verifyAadhaarOtp}
                disabled={
                  mobileNumber.length !== 10 ||
                  aadharnumber.length !== 12 ||
                  !isConsentProvided ||
                  isSubmitDisabled
                }
              />
            </div>
          ) : (
            <div className="mt-4 flex justify-end gap-4">
              <ActionButton
                buttonText={"Next"}
                width="w-[150px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={verifyMobileOTP}
                disabled={
                  mobileNumber.length !== 10 ||
                  mobileOtp.length !== 6 ||
                  !isConsentProvided ||
                  isSubmitDisabled
                }
              />
            </div>
          )}
          <div className="mt-5">
            <Divider />
          </div>
          <div className="mt-6">
            <NewAbhaSuggestions
              showConsent={showConsent}
              isConsentProvided={isConsentProvided}
              setShowConsent={setShowConsent}
              handleReset={() => handleClear()}
              formData={formData}
              setFormData={setFormData}
              setIsProcessDisabled={setIsProcessDisabled}
              isProcessDisabled={isProcessDisabled}
              handleDataClear={handleClear}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
